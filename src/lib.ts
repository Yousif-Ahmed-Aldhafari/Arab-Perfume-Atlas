import type { Fragrance, Price } from "./types";
export const genderAr = {
  Men: "رجالي",
  Women: "نسائي",
  Unisex: "للجنسين",
  Unknown: "غير معروف",
} as const;
export const priceLabel = (p: Price) =>
  p.amount !== null
    ? `${p.amount} ${p.currency}`
    : `${p.min}–${p.max} ${p.currency}`;
export const imagePath = (f: Fragrance) =>
  f.image.localPath
    ? `${import.meta.env.BASE_URL}${f.image.localPath.replace(/^\//, "")}`
    : `${import.meta.env.BASE_URL}images/image-unavailable.svg`;
export const searchText = (f: Fragrance) =>
  [
    f.brand,
    f.nameEn,
    f.nameAr,
    ...f.mainAccords,
    f.family,
    ...f.notes.top,
    ...f.notes.middle,
    ...f.notes.base,
    ...f.similar.map((x) => x.name),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("ar");
