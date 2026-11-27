import raw from './fragrances.json';import type{Fragrance}from'../types';export const fragrances=raw as Fragrance[];export const brands=[...new Set(fragrances.map(x=>x.brand))].sort();
