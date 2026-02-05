export type Option = { value: string; label: string };

export type TableConfig = {
  id: string;
  title: string;
  description: string;
  materials: Option[];
  clothColors: Option[];
  woodAccents: Option[];
  defaults: { material: string; clothColor: string; woodAccent: string };
  /** Optional explicit mapping from a selection triple to an image src in /public */
  imageMap?: Record<string, string>;
  /** Base path to look for images if not in imageMap. We'll compose `${basePath}/${material}_${clothColor}_${woodAccent}.jpg` */
  basePath?: string;
  /** Fallback image if composed path is missing (used for initial wiring). */
  fallbackSrc?: string;
};

export const MARBLE_TABLE_1: TableConfig = {
  id: "marble-table-1",
  title: "Marble Pool Table",
  description:
    "Premium marble pool table with configurable stone, cloth, and wood accent. Images are local; swap files later to change visuals.",
  // Variants aligned to your provided photos
  materials: [
    { value: "nero", label: "Nero Marquina" },
    { value: "calacatta", label: "Calacatta" },
  ],
  clothColors: [
    { value: "charcoal", label: "Charcoal" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "brown", label: "Brown" },
  ],
  woodAccents: [
    { value: "black", label: "Black" },
    { value: "walnut", label: "Walnut" },
  ],
  defaults: { material: "nero", clothColor: "charcoal", woodAccent: "black" },
  // Map exact combinations to filenames you should place under /public/detail/marble-table-1
  imageMap: {
    // Nero + cloth variants (black accent)
    "nero_charcoal_black": "/detail/marble-table-1/marble-table-1_nero_charcoal_black.png",
    "nero_blue_black": "/detail/marble-table-1/marble-table-1_nero_blue_black.png",
    "nero_green_black": "/detail/marble-table-1/marble-table-1_nero_green_black.png",
    "nero_brown_black": "/detail/marble-table-1/marble-table-1_nero_brown_black.png",

    // Nero + walnut accent examples
    "nero_charcoal_walnut": "/detail/marble-table-1/marble-table-1_nero_charcoal_walnut.png",
    "nero_blue_walnut": "/detail/marble-table-1/marble-table-1_nero_blue_walnut.png",

    // Calacatta examples
    "calacatta_charcoal_black": "/detail/marble-table-1/marble-table-1_calacatta_charcoal_black.png",
    "calacatta_blue_walnut": "/detail/marble-table-1/marble-table-1_calacatta_blue_walnut.png",
  },
  basePath: "/detail/marble-table-1",
  fallbackSrc: "/detail/marble-table-1/marble-table-1_nero_charcoal_black.png",
};

export function keyFor(material: string, clothColor: string, woodAccent: string) {
  return `${material}_${clothColor}_${woodAccent}`;
}
