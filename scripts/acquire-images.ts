import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, extname } from "node:path";
type Item = {
  id: string;
  url: string;
  destination: string;
  sourcePage: string;
  permission: "permitted" | "unknown" | "prohibited";
};
const manifest = JSON.parse(
  await readFile(new URL("./image-manifest.json", import.meta.url), "utf8"),
) as Item[];
const report: {
  id: string;
  status: string;
  detail?: string;
  sha256?: string;
}[] = [];
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
for (const item of manifest) {
  if (item.permission !== "permitted") {
    report.push({
      id: item.id,
      status: "skipped",
      detail: "permission not confirmed",
    });
    continue;
  }
  if (
    !/^https:\/\//.test(item.url) ||
    !item.destination.startsWith("public/images/perfumes/")
  ) {
    report.push({
      id: item.id,
      status: "rejected",
      detail: "unsafe path or URL",
    });
    continue;
  }
  try {
    await stat(item.destination);
    report.push({ id: item.id, status: "cached" });
    continue;
  } catch {
    // Cache miss: proceed with the permission-gated download.
  }
  let failure = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(item.url, {
        headers: { "User-Agent": "ArabPerfumeAtlasImageAuditor/1.0" },
      });
      if (!res.ok) throw Error(`HTTP ${res.status}`);
      const type = res.headers.get("content-type") || "";
      if (!type.startsWith("image/")) throw Error(`not an image: ${type}`);
      const bytes = Buffer.from(await res.arrayBuffer());
      if (bytes.length < 5000) throw Error("suspiciously small image");
      await mkdir(dirname(item.destination), { recursive: true });
      await writeFile(item.destination, bytes);
      report.push({
        id: item.id,
        status: "downloaded",
        detail: `${bytes.length} bytes ${extname(item.destination)}`,
        sha256: createHash("sha256").update(bytes).digest("hex"),
      });
      failure = "";
      break;
    } catch (e) {
      failure = String(e);
      await wait(attempt * 1000);
    }
  }
  if (failure) report.push({ id: item.id, status: "failed", detail: failure });
  await wait(750);
}
await writeFile(
  "image-verification-report.json",
  JSON.stringify(
    { generatedAt: new Date().toISOString(), items: report },
    null,
    2,
  ),
);
console.log(`Processed ${report.length} manifest entries.`);
