import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
const html = execFileSync("git", ["show", "c47bbc5:index.html"], {
  encoding: "utf8",
  maxBuffer: 2e6,
});
const match = html.match(/const raw=`([\s\S]*?)`;/);
if (!match) throw new Error("Legacy catalog not found");
const genders = { رجالي: "Men", نسائي: "Women", للجنسين: "Unisex" };
const slug = (value) =>
  value
    .normalize("NFKD")
    .replace(/[’']/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase();
const rows = match[1]
  .trim()
  .split("\n")
  .map((line, index) => {
    const [brand, name, gender, low, high, similar, similarPrice, accords] =
      line.split("|");
    return {
      id: slug(`${brand}-${name}`) || `legacy-${index}`,
      brand,
      nameEn: name,
      nameAr: null,
      gender: genders[gender] ?? "Unknown",
      releaseYear: null,
      concentration: null,
      bottleSizesMl: [],
      descriptionEn: null,
      descriptionAr: null,
      notes: { top: [], middle: [], base: [] },
      mainAccords: accords
        ? accords
            .split(/[،؛]/)
            .map((x) => x.trim())
            .filter(Boolean)
        : [],
      family: null,
      seasons: [],
      occasions: [],
      prices: [
        {
          amount: low === high ? +low : null,
          min: +low,
          max: +high,
          currency: "USD",
          region: "Unknown",
          sizeMl: null,
          type: "estimated",
          sourceUrl:
            brand === "Afnan" ? "https://us.afnan.com/collections/all" : null,
          verifiedAt: null,
        },
      ],
      image: {
        localPath: null,
        sourceUrl:
          name === "Supremacy Incense"
            ? "https://uae.afnan.com/products/supremacy-incense"
            : null,
        licenseStatus: "unknown",
        verified: false,
      },
      officialUrl:
        name === "Supremacy Incense"
          ? "https://afnan.com/products/supremacy-incense"
          : null,
      sources:
        brand === "Afnan" ? ["https://us.afnan.com/collections/all"] : [],
      similar: similar
        ? [
            {
              name: similar,
              priceLabel: similarPrice || null,
              relationship: "commonly-reported",
              status: "unverified",
              sources: [],
            },
          ]
        : [],
      alternatives: [],
      verificationStatus: "legacy-unverified",
    };
  });
writeFileSync("src/data/fragrances.json", `${JSON.stringify(rows, null, 2)}\n`);
console.log(
  `Migrated ${rows.length} fragrances across ${new Set(rows.map((x) => x.brand)).size} brands.`,
);
