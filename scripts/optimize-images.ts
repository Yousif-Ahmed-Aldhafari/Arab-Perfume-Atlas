import { execFile } from "node:child_process";
import { readFile, stat, unlink, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import fragrances from "../src/data/fragrances.json" with { type: "json" };

const run = promisify(execFile);
let converted = 0;
let bytesBefore = 0;
let bytesAfter = 0;

for (const fragrance of fragrances.filter((item) => item.image.localPath)) {
  const relative = fragrance.image.localPath!;
  const source = `src/${relative}`;
  const destination = source.replace(/\.(jpe?g|png)$/i, ".webp");
  if (source === destination) continue;
  const before = await stat(source);
  await run("convert", [
    source,
    "-auto-orient",
    "-resize",
    "1600x1600>",
    "-strip",
    "-quality",
    "82",
    destination,
  ]);
  const result = await readFile(destination);
  if (result.subarray(0, 4).toString() !== "RIFF" || result.length < 5_000)
    throw new Error(`Invalid WebP output: ${destination}`);
  const after = await stat(destination);
  fragrance.image.localPath = relative.replace(/\.(jpe?g|png)$/i, ".webp");
  await unlink(source);
  converted++;
  bytesBefore += before.size;
  bytesAfter += after.size;
}

await writeFile(
  "src/data/fragrances.json",
  `${JSON.stringify(fragrances, null, 2)}\n`,
);
console.log(
  JSON.stringify({ converted, bytesBefore, bytesAfter, saved: bytesBefore - bytesAfter }),
);
