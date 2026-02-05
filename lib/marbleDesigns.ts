/**
 * Marble designs and variants configuration
 * 
 * TO ADD A NEW VARIANT:
 * 1. Upload the image file to /public/detail/marble-table-1/
 * 2. Name it following the pattern: marble-table-1_{material}_{cloth}_{wood}.png
 *    Example: marble-table-1_nero_green_walnut.png
 * 3. Add the variant object to the design's variants array below
 * 4. Restart the dev server to see the changes
 */

import { keyFor } from "./tableData";

export type MarbleVariant = {
  material: string;
  cloth: string;
  wood: string;
  image: string;
};

export type MarbleDesign = {
  slug: string;
  name: string;
  heroImage: string;
  description: string;
  variants: MarbleVariant[];
};

export const MARBLE_DESIGNS: MarbleDesign[] = [
  {
    slug: "nero-signature",
    name: "Nero Signature",
    heroImage: "/homepage/marble/marble-1.png",
    description: "Deep black marble with modern base and charcoal cloth.",
    variants: [
      {
        material: "nero",
        cloth: "charcoal",
        wood: "black",
        image: "/detail/marble-table-1/marble-table-1_nero_charcoal_black.png",
      },
      {
        material: "nero",
        cloth: "blue",
        wood: "black",
        image: "/detail/marble-table-1/marble-table-1_nero_blue_black.png",
      },
      {
        material: "nero",
        cloth: "green",
        wood: "black",
        image: "/detail/marble-table-1/marble-table-1_nero_green_black.png",
      },
      {
        material: "nero",
        cloth: "charcoal",
        wood: "walnut",
        image: "/detail/marble-table-1/marble-table-1_nero_charcoal_walnut.png",
      },
      {
        material: "nero",
        cloth: "blue",
        wood: "walnut",
        image: "/detail/marble-table-1/marble-table-1_nero_blue_walnut.png",
      },
    ],
  },
  {
    slug: "calacatta-gallery",
    name: "Calacatta Gallery",
    heroImage: "/homepage/marble/marble-2.png",
    description: "Light Calacatta marble with warm wood details.",
    variants: [
      {
        material: "calacatta",
        cloth: "charcoal",
        wood: "black",
        image: "/detail/marble-table-1/marble-table-1_calacatta_charcoal_black.png",
      },
      {
        material: "calacatta",
        cloth: "blue",
        wood: "walnut",
        image: "/detail/marble-table-1/marble-table-1_calacatta_blue_walnut.png",
      },
    ],
  },
];

export function buildImageMapFromDesign(slug: string): Record<string, string> {
  const design = MARBLE_DESIGNS.find((d) => d.slug === slug) ?? MARBLE_DESIGNS[0];
  const map: Record<string, string> = {};
  design.variants.forEach((v) => {
    map[keyFor(v.material, v.cloth, v.wood)] = v.image;
  });
  return map;
}
