import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import fragrances from "../src/data/fragrances.json" with { type: "json" };

type Product = {
  title: string;
  url: string;
  imageUrl: string;
  source: "official-afnan" | "official-armaf" | "official-lattafa";
};

const normalize = (value: string) =>
  value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/\b(eau de parfum|eau de toilette|edp|edt|perfume|parfum)\b/g, " ")
    .replace(/\b\d+\s*(ml|oz)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const run = promisify(execFile);
const cacheDirectory = ".cache/official-catalogs";
await mkdir(cacheDirectory, { recursive: true });
const fetchJson = async <T>(url: string): Promise<T> => {
  const cachePath = `${cacheDirectory}/${createHash("sha256").update(url).digest("hex")}.json`;
  try {
    return JSON.parse(await readFile(cachePath, "utf8")) as T;
  } catch {
    console.log(`Fetching ${url}`);
  }
  const { stdout } = await run(
    "curl",
    [
      "-4",
      "--fail",
      "--location",
      "--retry",
      "5",
      "--retry-all-errors",
      "--connect-timeout",
      "20",
      "--max-time",
      "120",
      "--silent",
      "--show-error",
      "--user-agent",
      "Mozilla/5.0 (compatible; ArabPerfumeAtlas/1.0)",
      url,
    ],
    { maxBuffer: 20 * 1024 * 1024 },
  );
  JSON.parse(stdout);
  await writeFile(cachePath, stdout);
  return JSON.parse(stdout) as T;
};

const shopify = async (
  domain: string,
  source: Product["source"],
): Promise<Product[]> => {
  const data = await fetchJson<{
    products: Array<{
      title: string;
      handle: string;
      images: Array<{ src: string }>;
    }>;
  }>(`https://${domain}/products.json?limit=250`);
  console.log(`${domain}: ${data.products.length} products`);
  return data.products
    .filter((product) => product.images[0]?.src)
    .map((product) => ({
      title: product.title,
      url: `https://${domain}/products/${product.handle}`,
      imageUrl: product.images[0].src,
      source,
    }));
};

const lattafa = async (): Promise<Product[]> => {
  const products: Product[] = [];
  for (let page = 1; page <= 10; page++) {
    const data = await fetchJson<
      Array<{
        name: string;
        permalink: string;
        images: Array<{ src: string }>;
      }>
    >(`https://lattafa.com/wp-json/wc/store/v1/products?per_page=100&page=${page}`);
    console.log(`lattafa.com page ${page}: ${data.length} products`);
    if (!data.length) break;
    products.push(
      ...data
        .filter((product) => product.images[0]?.src)
        .map((product) => ({
          title: product.name,
          url: product.permalink,
          imageUrl: product.images[0].src,
          source: "official-lattafa" as const,
        })),
    );
    if (data.length < 100) break;
  }
  return products;
};

const safe = async (label: string, load: () => Promise<Product[]>) => {
  try {
    return await load();
  } catch (error) {
    console.error(`${label} unavailable: ${String(error)}`);
    return [];
  }
};
const products = [
  ...(process.env.SKIP_BLOCKED_SOURCES
    ? []
    : await safe("Afnan", () => shopify("afnan.com", "official-afnan"))),
  ...(process.env.SKIP_BLOCKED_SOURCES
    ? []
    : await safe("Armaf", () => shopify("armaf.com", "official-armaf"))),
  ...(await safe("Lattafa", lattafa)),
];

const brandSource: Record<string, Product["source"]> = {
  Afnan: "official-afnan",
  Armaf: "official-armaf",
  Lattafa: "official-lattafa",
};
const officialTitleAliases: Record<string, string> = {
  "lattafa-badee-al-oud-oud-for-glory": "Badee Al Oud &#8211; Oud for glory",
  "lattafa-badee-al-oud-honor-glory": "Badee Al Oud Honor and Glory",
  "lattafa-fakhar-black": "Fakhar Lattafa Men",
  "lattafa-the-kingdom-for-men": "Kingdom Men",
  "lattafa-ramz-silver": "Ramz Lattafa Silver",
  "lattafa-suqraat": "Suqaraat",
  "lattafa-teriaq-intense": "Lattafa Teriaq Intense",
  "lattafa-ameer-al-oud-intense-oud": "Ameer Al Oudh &#8211; Intense",
  "lattafa-fakhar-rose": "Fakhar Lattafa Women",
};

const results = fragrances
  .filter((fragrance) => brandSource[fragrance.brand])
  .map((fragrance) => {
    const target = normalize(
      officialTitleAliases[fragrance.id] || fragrance.nameEn,
    );
    const matches = products
      .filter((product) => product.source === brandSource[fragrance.brand])
      .filter((product) => normalize(product.title) === target);
    const candidates = [
      ...new Map(matches.map((product) => [product.imageUrl, product])).values(),
    ];
    return {
      id: fragrance.id,
      brand: fragrance.brand,
      name: fragrance.nameEn,
      status: candidates.length === 1 ? "exact" : candidates.length ? "ambiguous" : "missing",
      candidates,
    };
  });

await writeFile(
  "official-image-candidates.json",
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      catalogProducts: products.length,
      exact: results.filter((item) => item.status === "exact").length,
      ambiguous: results.filter((item) => item.status === "ambiguous").length,
      missing: results.filter((item) => item.status === "missing").length,
      results,
    },
    null,
    2,
  )}\n`,
);

console.log(
  JSON.stringify(
    {
      catalogProducts: products.length,
      requested: results.length,
      exact: results.filter((item) => item.status === "exact").length,
      ambiguous: results.filter((item) => item.status === "ambiguous").length,
      missing: results.filter((item) => item.status === "missing").length,
    },
    null,
    2,
  ),
);
