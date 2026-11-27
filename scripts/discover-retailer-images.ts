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
  { domain: "perfumebox.com", source: "retailer-perfume-box" },
  { domain: "fragranceoutlet.com", source: "retailer-fragrance-outlet" },
  { domain: "labelleperfumes.com", source: "retailer-la-belle" },
  { domain: "filledwithbarakah.com", source: "retailer-filled-with-barakah" },
  { domain: "soghaat.co.uk", source: "retailer-soghaat" },
  { domain: "dubaiperfumeshop.ie", source: "retailer-dubai-perfume-shop" },
  { domain: "oudstore.com", source: "retailer-oud-store" },
] as const;
// These search results are distinct editions, not the exact catalog item.
const rejectedCandidateIds = new Set([
  "maison-alhambra-tabac",
  "maison-alhambra-tobacco-touch",
  "maison-alhambra-woody-oud",
  "lattafa-badee-al-oud-amethyst",
]);
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
  "ard-al-zaafaran-midnight-oud":
    "https://soghaat.co.uk/products/midnight-oud-100ml-edp-by-ard-al-zaafaran",
};
const manuallyVerifiedCandidates: Record<string, Candidate> = {
  "maison-alhambra-tabac": {
    title: "Tabac 100ml By Maison Alhambra - Eau De Parfum",
    url: "https://eaperfumes.co.uk/products/tabac-100ml-by-maison-alhambra-eau-de-parfum",
    imageUrl: "https://eaperfumes.co.uk/storage/catalog/products/tabac.jpg",
    source: "retailer-ea-perfumes",
  },
  "maison-alhambra-tobacco-touch": {
    title: "Maison Al Hambra Tobacco Touch EDP 80 ml",
    url: "https://silkperfumes.cl/products/maison-al-hambra-tabacco-touch-edp-80-ml",
    imageUrl:
      "https://silkperfumes.cl/cdn/shop/products/maison-al-hambra-tabacco-touch-edp-80ml-Silk-Perfumes-1.jpg?crop=center&height=1200&v=1747681819&width=1200",
    source: "retailer-silk-perfumes",
  },
  "maison-alhambra-woody-oud": {
    title: "Woody Oud Eau de Parfum Spray 80ml by Maison Alhambra",
    url: "https://www.intenseoud.com/products/woody-oud-for-men-edp-80ml-2-7oz-by-maison-alhambra",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0127/7840/5947/products/Untitleddesign_96_cd03827a-f882-4288-a1e3-be803e66d89a.png?v=1677363863",
    source: "retailer-intense-oud",
  },
  "armaf-legesi-homme": {
    title: "Armaf Legesi Homme EDP 100 ml",
    url: "https://priveperfumes.com/en/products/perfume-armaf-legesi-homme-edp-m-100-ml",
    imageUrl:
      "https://priveperfumes.com/cdn/shop/files/perfume-armaf-legesi-homme-edp-m-100-ml-1-prive-perfumes.webp?v=1738136223&width=1024",
    source: "retailer-prive-perfumes",
  },
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
  const preferred =
    manuallyVerifiedCandidates[fragrance.id] ??
    (preferredUrl
      ? deduplicatedCandidates.find(
          (candidate) => candidate.url === preferredUrl,
        )
      : rejectedCandidateIds.has(fragrance.id)
        ? undefined
        : unique[0]);
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
