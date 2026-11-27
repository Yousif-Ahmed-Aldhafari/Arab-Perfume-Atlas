# Catalog maintenance

The catalog lives in `src/data/fragrances.json`. Missing facts must remain `null` or an empty array until a reliable source is recorded. Never turn a price range into a point price, a conversion into a retailer price, or a community comparison into an official inspiration claim.

## Updating a record

1. Prefer an official product page, then an authorized regional retailer.
2. Add the source URL to `sources` and the relevant field-specific source.
3. Use ISO `YYYY-MM-DD` dates for price checks.
4. Run `npm run data:validate` and `npm test`.

## Images

Only add an image to `scripts/image-manifest.json` when reuse/download permission has been checked. Set `permission` to `permitted`, run `npm run images:acquire`, visually confirm the exact edition, inspect `image-verification-report.json`, then set the record's `image.localPath`, `sourceUrl`, and `verified`. The site intentionally shows an unavailable state otherwise. Do not hotlink or generate bottle images.

## Legacy provenance

The initial 112 records were migrated from `perfume-atlas-light.html`. Sparse prices and comparisons are retained for continuity but explicitly marked estimated/unverified. `scripts/migrate-legacy.mjs` documents that one-time transformation.
