import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { promisify } from "node:util";
import fragrances from "../src/data/fragrances.json" with { type: "json" };

type Candidate = {
  id: string;
  brand: string;
  name: string;
  status: string;
  candidates: Array<{
    title: string;
    url: string;
    imageUrl: string;
    source: string;
  }>;
};

const discovery = JSON.parse(
  await readFile(
    process.env.IMAGE_CANDIDATES || "official-image-candidates.json",
    "utf8",
  ),
) as { results: Candidate[] };
type CatalogRecord = Omit<(typeof fragrances)[number], "sources"> & {
  sources: string[];
};
const catalog = fragrances as CatalogRecord[];
const run = promisify(execFile);
const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const extensionFor = (bytes: Buffer) => {
  if (bytes.subarray(0, 3).toString("hex") === "ffd8ff") return "jpg";
  if (bytes.subarray(1, 4).toString() === "PNG") return "png";
  if (bytes.subarray(0, 4).toString() === "RIFF") return "webp";
  if (bytes.subarray(4, 12).toString().includes("ftypavif")) return "avif";
  throw new Error("Unsupported or corrupt image signature");
};

const report: Array<Record<string, unknown>> = [];
for (const result of discovery.results.filter(
  (item) => item.status === "exact",
)) {
  const candidate = result.candidates[0];
  const existingRecord = catalog.find((item) => item.id === result.id);
  if (existingRecord?.image.localPath) {
    report.push({ id: result.id, status: "cached" });
    continue;
  }
  const temporary = `.cache/image-${result.id}`;
  await mkdir(dirname(temporary), { recursive: true });
  try {
    await run(
      "curl",
      [
        "-4",
        "--fail",
        "--location",
        "--retry",
        "4",
        "--retry-all-errors",
        "--connect-timeout",
        "20",
        "--max-time",
        "120",
        "--silent",
        "--show-error",
        "--output",
        temporary,
        candidate.imageUrl,
      ],
      { maxBuffer: 2 * 1024 * 1024 },
    );
    const bytes = await readFile(temporary);
    if (bytes.length < 5_000) throw new Error("Image is suspiciously small");
    const extension = extensionFor(bytes);
    const relative = `assets/perfumes/${slug(result.brand)}/${result.id}.${extension}`;
    const destination = `src/${relative}`;
    await mkdir(dirname(destination), { recursive: true });
    await rename(temporary, destination);
    const record = existingRecord;
    if (!record) throw new Error("Catalog record missing");
    record.image.localPath = relative;
    record.image.sourceUrl = candidate.url;
    record.image.licenseStatus =
      process.env.IMAGE_LICENSE_STATUS || "official-source-reuse-unverified";
    record.image.verified = true;
    if (!record.sources.includes(candidate.url))
      record.sources.push(candidate.url);
    report.push({
      id: result.id,
      status: "downloaded",
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
      productPage: candidate.url,
      imageUrl: candidate.imageUrl,
      destination,
    });
    console.log(`Downloaded ${result.brand} — ${result.name}`);
  } catch (error) {
    try {
      await stat(temporary);
      await rename(temporary, `${temporary}.failed`);
    } catch {
      // No partial file was produced.
    }
    report.push({ id: result.id, status: "failed", error: String(error) });
    console.error(`Failed ${result.brand} — ${result.name}: ${String(error)}`);
  }
}

await writeFile(
  "src/data/fragrances.json",
  `${JSON.stringify(catalog, null, 2)}\n`,
);
await writeFile(
  "image-verification-report.json",
  `${JSON.stringify({ generatedAt: new Date().toISOString(), items: report }, null, 2)}\n`,
);
console.log(
  `${report.filter((item) => item.status === "downloaded").length}/${report.length} official images imported.`,
);
