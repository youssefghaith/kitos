import { MARBLE_DESIGNS, type MarbleDesign, type MarbleVariant } from "./marbleDesigns";

export type CategoryRecord = {
  slug: string;
  name: string;
  description?: string;
  hero_image_url?: string;
};

const DEFAULT_CATEGORIES: CategoryRecord[] = [
  { slug: "marble", name: "Marble", description: "", hero_image_url: "" },
  { slug: "wood", name: "Wood", description: "", hero_image_url: "" },
  { slug: "hybrid", name: "Hybrid", description: "", hero_image_url: "" },
];

/**
 * Fetch marble designs with variants
 * In production with Cloudflare, this will fetch from D1
 * In local dev, it returns static data from marbleDesigns.ts
 */
export async function getDesignsByCategory(category: string): Promise<MarbleDesign[]> {
  // Try to fetch from API (which uses D1 if available)
  if (typeof window !== "undefined") {
    // Client-side: fetch from API
    try {
      const response = await fetch(`/api/cloudflare/designs?category=${encodeURIComponent(category)}&featured=1`);
      if (response.ok) {
        const data = await response.json();
        if (data.designs && data.designs.length > 0) {
          return data.designs;
        }
      }
    } catch (err) {
      console.error("Failed to fetch from API, using local data:", err);
    }
  }

  // Fallback to local static data for marble only
  if (category === "marble") {
    return MARBLE_DESIGNS;
  }

  return [];
}

export async function getMarbleDesigns(): Promise<MarbleDesign[]> {
  return getDesignsByCategory("marble");
}

export async function getCategory(slug: string): Promise<CategoryRecord | null> {
  if (typeof window !== "undefined") {
    try {
      const response = await fetch(`/api/cloudflare/categories?slug=${encodeURIComponent(slug)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.category) return data.category;
      }
    } catch (err) {
      console.error("Failed to fetch category:", err);
    }
  }

  return DEFAULT_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export async function getDesignRecord(slug: string): Promise<any | null> {
  if (typeof window !== "undefined") {
    try {
      const response = await fetch("/api/cloudflare/designs?all=1");
      if (response.ok) {
        const data = await response.json();
        const designs = (data.designs as any[]) ?? [];
        return designs.find((d) => d.slug === slug) ?? null;
      }
    } catch (err) {
      console.error("Failed to fetch design record:", err);
    }
  }

  const fallback = MARBLE_DESIGNS.find((d) => d.slug === slug);
  if (fallback) {
    return {
      slug: fallback.slug,
      name: fallback.name,
      category: "marble",
      short_description: fallback.description,
      hero_image_url: fallback.heroImage,
      option_groups: [
        {
          key: "material",
          name: "Material",
          options: Array.from(new Set(fallback.variants.map((v) => v.material))),
        },
        {
          key: "cloth",
          name: "Cloth",
          options: Array.from(new Set(fallback.variants.map((v) => v.cloth))),
        },
        {
          key: "wood_accent",
          name: "Wood accent",
          options: Array.from(new Set(fallback.variants.map((v) => v.wood))),
        },
      ],
    };
  }

  return null;
}

/**
 * Fetch variants for a specific design
 */
export async function getDesignVariants(slug: string): Promise<MarbleVariant[]> {
  // Try to fetch from API
  if (typeof window !== "undefined") {
    try {
      const response = await fetch(`/api/cloudflare/variants?design_slug=${slug}`);
      if (response.ok) {
        const data = await response.json();
        if (data.variants && data.variants.length > 0) {
          return data.variants;
        }
      }
    } catch (err) {
      console.error("Failed to fetch variants from API, using local data:", err);
    }
  }

  // Fallback to local static data
  const design = MARBLE_DESIGNS.find((d) => d.slug === slug);
  return design?.variants || [];
}
