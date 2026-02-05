import { MARBLE_TABLE_1 } from "./tableData";
import { getCloudflareEnv } from "./cloudflare";

export type DesignRecord = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string | null;
  hero_image_url: string | null;
  option_groups?: OptionGroup[];
};

export type VariantRecord = {
  id: string;
  design_id: string;
  material: string;
  cloth: string;
  wood_accent: string;
  image_url: string;
  options?: Record<string, string>;
};

export type OptionGroup = {
  key: string;
  name: string;
  options: string[];
};

const FALLBACK_MARBLE_DESIGNS: DesignRecord[] = [
  {
    id: "fallback-nero-signature",
    slug: "nero-signature",
    name: "Nero Signature",
    category: "marble",
    short_description: "Deep black marble with modern base and charcoal cloth.",
    hero_image_url: "/homepage/marble/marble-1.png",
  },
  {
    id: "fallback-calacatta-gallery",
    slug: "calacatta-gallery",
    name: "Calacatta Gallery",
    category: "marble",
    short_description: "Light Calacatta marble with warm wood details.",
    hero_image_url: "/homepage/marble/marble-2.png",
  },
  {
    id: "fallback-studio-slab",
    slug: "studio-slab",
    name: "Studio Slab",
    category: "marble",
    short_description: "Minimal slab design for contemporary interiors.",
    hero_image_url: "/homepage/marble/marble-3.png",
  },
];

export async function getFeaturedMarbleDesigns(): Promise<DesignRecord[]> {
  try {
    const cfEnv = getCloudflareEnv();
    if (cfEnv) {
      const results = await cfEnv.DB.prepare(
        "SELECT id, slug, name, category, short_description, hero_image_url FROM designs WHERE category = 'marble' AND is_featured = 1 ORDER BY created_at"
      ).all();

      if (results.results && results.results.length > 0) {
        return results.results as DesignRecord[];
      }
    }

    return FALLBACK_MARBLE_DESIGNS;
  } catch {
    return FALLBACK_MARBLE_DESIGNS;
  }
}

export async function getDesignBySlug(slug: string): Promise<DesignRecord | null> {
  try {
    const cfEnv = getCloudflareEnv();
    if (cfEnv) {
      const result = await cfEnv.DB.prepare(
        "SELECT id, slug, name, category, short_description, hero_image_url FROM designs WHERE slug = ? LIMIT 1"
      )
        .bind(slug)
        .first();

      if (result) {
        return result as DesignRecord;
      }
    }

    return (
      FALLBACK_MARBLE_DESIGNS.find((d) => d.slug === slug) ?? FALLBACK_MARBLE_DESIGNS[0] ?? null
    );
  } catch {
    return (
      FALLBACK_MARBLE_DESIGNS.find((d) => d.slug === slug) ?? FALLBACK_MARBLE_DESIGNS[0] ?? null
    );
  }
}

export async function getVariantsForDesign(designId: string): Promise<VariantRecord[]> {
  try {
    const cfEnv = getCloudflareEnv();
    if (cfEnv) {
      const results = await cfEnv.DB.prepare(
        "SELECT id, design_id, material, cloth, wood_accent, image_url FROM variants WHERE design_id = ?"
      )
        .bind(designId)
        .all();

      if (results.results && results.results.length > 0) {
        return results.results as VariantRecord[];
      }
    }

    return variantsFromLocal();
  } catch {
    return variantsFromLocal();
  }
}

function variantsFromLocal(): VariantRecord[] {
  // Map the existing MARBLE_TABLE_1.imageMap into VariantRecord-like rows
  const records: VariantRecord[] = [];
  if (!MARBLE_TABLE_1.imageMap) return records;

  const designId = "fallback-marble-table-1";
  Object.entries(MARBLE_TABLE_1.imageMap).forEach(([key, image_url]) => {
    const [material, cloth, wood_accent] = key.split("_");
    records.push({
      id: `${designId}-${key}`,
      design_id: designId,
      material,
      cloth,
      wood_accent,
      image_url,
    });
  });

  return records;
}
