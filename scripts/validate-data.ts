import data from "../src/data/fragrances.json" with { type: "json" };
const errors: string[] = [];
const warnings: string[] = [];
const ids = new Set<string>();
const identity = new Set<string>();
for (const f of data) {
  if (ids.has(f.id)) errors.push(`duplicate id: ${f.id}`);
  ids.add(f.id);
  const k = `${f.brand}|${f.nameEn}`.toLowerCase();
  if (identity.has(k)) errors.push(`duplicate fragrance: ${k}`);
  identity.add(k);
  if (!f.brand || !f.nameEn) errors.push(`missing identity: ${f.id}`);
  for (const p of f.prices) {
    if (p.min < 0 || p.max < p.min) errors.push(`invalid price: ${f.id}`);
    if (p.type === "verified-retailer" && (!p.sourceUrl || !p.verifiedAt))
      errors.push(`unsubstantiated verified price: ${f.id}`);
  }
  if (f.image.localPath === null) warnings.push(`missing image: ${f.id}`);
  if (f.similar.some((x) => x.status === "verified" && x.sources.length === 0))
    errors.push(`verified similarity without source: ${f.id}`);
}
console.log(
  JSON.stringify(
    {
      records: data.length,
      brands: new Set(data.map((x) => x.brand)).size,
      errors: errors.length,
      warnings: warnings.length,
      missingImages: warnings.length,
    },
    null,
    2,
  ),
);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
