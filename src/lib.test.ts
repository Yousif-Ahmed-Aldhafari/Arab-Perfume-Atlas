import { describe, expect, it } from "vitest";
import { fragrances } from "./data/catalog";
import { priceLabel, searchText } from "./lib";
describe("catalog helpers", () => {
  it("preserves the 112-entry legacy catalog", () =>
    expect(fragrances).toHaveLength(112));
  it("indexes Arabic and English metadata", () => {
    const f = fragrances[0];
    expect(searchText(f)).toContain(f.brand.toLowerCase());
    expect(searchText(f)).toContain("بخور");
  });
  it("labels ranges without inventing a point price", () =>
    expect(priceLabel(fragrances[1].prices[0])).toBe("25–50 USD"));
});
