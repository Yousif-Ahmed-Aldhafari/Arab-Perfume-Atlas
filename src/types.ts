export type Gender = "Men" | "Women" | "Unisex" | "Unknown";
export type Price = {
  amount: number | null;
  min: number;
  max: number;
  currency: "USD" | "SAR" | "AED" | "YER";
  region: string;
  sizeMl: number | null;
  type: "verified-retailer" | "estimated" | "converted";
  sourceUrl: string | null;
  verifiedAt: string | null;
};
export type Similar = {
  name: string;
  priceLabel: string | null;
  relationship:
    "official-inspiration" | "commonly-reported" | "similar-profile";
  status: "verified" | "unverified";
  sources: string[];
};
export type Fragrance = {
  id: string;
  brand: string;
  nameEn: string;
  nameAr: string | null;
  gender: Gender;
  releaseYear: number | null;
  concentration: string | null;
  bottleSizesMl: number[];
  descriptionEn: string | null;
  descriptionAr: string | null;
  notes: { top: string[]; middle: string[]; base: string[] };
  mainAccords: string[];
  family: string | null;
  seasons: string[];
  occasions: string[];
  prices: Price[];
  image: {
    localPath: string | null;
    sourceUrl: string | null;
    licenseStatus: string;
    verified: boolean;
  };
  officialUrl: string | null;
  sources: string[];
  similar: Similar[];
  alternatives: Similar[];
  verificationStatus: string;
};
