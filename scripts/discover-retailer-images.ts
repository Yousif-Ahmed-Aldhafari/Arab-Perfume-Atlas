import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import fragrances from "../src/data/fragrances.json" with { type: "json" };

type SearchProduct = {
  title: string;
  url: string;
  image?: string;
  vendor?: string;
};

type Candidate = {
  title: string;
  url: string;
  imageUrl: string;
  source: string;
};

const retailers = [
  { domain: "perfumeonline.ca", source: "retailer-perfume-online" },
  { domain: "tripletraders.com", source: "retailer-triple-traders" },
  { domain: "intenseoud.com", source: "retailer-intense-oud" },
] as const;
// These search results are distinct editions, not the exact catalog item.
const rejectedCandidateIds = new Set(["lattafa-badee-al-oud-amethyst"]);
const preferredProductUrls: Record<string, string> = {
  "al-haramain-amber-oud-tobacco-edition":
    "https://perfumeonline.ca/products/amber-oud-tobacco-edition",
  "paris-corner-charuto-tobacco-vanille":
    "https://perfumeonline.ca/products/charuto-tobacco-vanille-pendora",
  "paris-corner-killer-oud": "https://perfumeonline.ca/products/killer-oud",
  "rasasi-la-yuqawam-homme":
    "https://tripletraders.com/products/layuqawam-eau-de-parfum-by-rasasi-75ml-2-53-fl-oz",
  "paris-corner-killer-oud-ethic":
    "https://perfumeonline.ca/products/killer-oud-ethic",
  "ajmal-evoke-gold-for-him":
    "https://perfumeonline.ca/products/ajmal-evoke-gold-edition",
  "lattafa-badee-al-oud-amethyst":
    "https://perfumeonline.ca/products/badee-al-oud-amethyst",
};
const run = promisify(execFile);
await mkdir(".cache/retailer-search", { recursive: true });

const normalize = (value: string) =>
  value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(
      /\b(eau de parfum|eau de toilette|edp|edt|perfume|parfum|spray)\b/g,
      " ",
    )
    .replace(/\b\d+(?:\.\d+)?\s*(ml|oz|fl oz)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const containsPhrase = (text: string, phrase: string) =>
  ` ${text} `.includes(` ${phrase} `);

const search = async (
  domain: string,
  source: string,
  query: string,
): Promise<Candidate[]> => {
  const cacheName = `${domain}-${query}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  const cachePath = `.cache/retailer-search/${cacheName}.json`;
  let raw: string;
  try {
    raw = await readFile(cachePath, "utf8");
  } catch {
    const parameters = new URLSearchParams({
      q: query,
      "resources[type]": "product",
      "resources[limit]": "10",
    });
    const endpoint = `https://${domain}/search/suggest.json?${parameters}`;
    const response = await run(
      "curl",
      [
        "-4",
        "--globoff",
        "--fail",
        "--location",
        "--retry",
        "3",
        "--connect-timeout",
        "20",
        "--max-time",
        "60",
        "--silent",
        "--show-error",
        "--user-agent",
        "Mozilla/5.0 (compatible; ArabPerfumeAtlas/1.0)",
        endpoint,
      ],
      { maxBuffer: 10 * 1024 * 1024 },
    );
    raw = response.stdout;
    JSON.parse(raw);
    await writeFile(cachePath, raw);
  }
  const payload = JSON.parse(raw) as {
    resources?: { results?: { products?: SearchProduct[] } };
  };
  return (payload.resources?.results?.products ?? [])
    .filter((product) => product.image)
    .map((product) => ({
      title: product.title,
      url: `https://${domain}${product.url.split("?")[0]}`,
      imageUrl: product.image as string,
      source,
    }));
};

const results = [];
for (const fragrance of fragrances.filter((item) => !item.image.localPath)) {
  const candidates = (
    await Promise.all(
      retailers.flatMap((retailer) =>
        [`${fragrance.brand} ${fragrance.nameEn}`, fragrance.nameEn].map(
          (query) =>
            search(retailer.domain, retailer.source, query).catch((error) => {
              console.error(`${retailer.domain}: ${String(error)}`);
              return [];
            }),
        ),
      ),
    )
  ).flat();
  const deduplicatedCandidates = [
    ...new Map(
      candidates.map((candidate) => [candidate.url, candidate]),
    ).values(),
  ];
  const name = normalize(fragrance.nameEn);
  const brand = normalize(fragrance.brand);
  const exact = deduplicatedCandidates.filter((candidate) => {
    const title = normalize(candidate.title);
    return containsPhrase(title, name) && containsPhrase(title, brand);
  });
  const unique = [
    ...new Map(
      exact.map((candidate) => [candidate.imageUrl, candidate]),
    ).values(),
  ];
  const preferredUrl = preferredProductUrls[fragrance.id];
  const preferred = preferredUrl
    ? deduplicatedCandidates.find((candidate) => candidate.url === preferredUrl)
    : rejectedCandidateIds.has(fragrance.id)
      ? undefined
      : unique[0];
  results.push({
    id: fragrance.id,
    brand: fragrance.brand,
    name: fragrance.nameEn,
    status: preferred ? "exact" : "missing",
    candidates: preferred ? [preferred] : [],
    alternateExactCandidates: unique.slice(1),
    searchCandidates: deduplicatedCandidates,
  });
  console.log(`${fragrance.id}: ${unique.length} exact candidates`);
}

await writeFile(
  "retailer-image-candidates.json",
  `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`,
);
console.log({
  exact: results.filter((item) => item.status === "exact").length,
  ambiguous: results.filter((item) => item.status === "ambiguous").length,
  missing: results.filter((item) => item.status === "missing").length,
});
