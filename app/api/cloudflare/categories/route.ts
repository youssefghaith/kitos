import { NextRequest, NextResponse } from "next/server";
import { getCloudflareEnv } from "@/lib/cloudflare";

export const runtime = "edge";

type LocalCategory = {
  slug: string;
  name: string;
  description?: string;
  hero_image_url?: string;
};

const DEFAULT_CATEGORIES: LocalCategory[] = [
  { slug: "marble", name: "Marble", description: "", hero_image_url: "" },
  { slug: "wood", name: "Wood", description: "", hero_image_url: "" },
  { slug: "hybrid", name: "Hybrid", description: "", hero_image_url: "" },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    const cfEnv = getCloudflareEnv();
    if (cfEnv) {
      if (slug) {
        const row = await cfEnv.DB.prepare(
          "SELECT * FROM categories WHERE slug = ? LIMIT 1"
        )
          .bind(slug)
          .first();
        return NextResponse.json({ category: row ?? null });
      }

      const results = await cfEnv.DB.prepare(
        "SELECT * FROM categories ORDER BY slug"
      ).all();
      return NextResponse.json({ categories: results.results ?? [] });
    }

    if (slug) {
      const category = DEFAULT_CATEGORIES.find((c) => c.slug === slug) ?? null;
      return NextResponse.json({ category });
    }

    return NextResponse.json({ categories: DEFAULT_CATEGORIES });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, name, description, hero_image_url } = body as LocalCategory;

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    const cfEnv = getCloudflareEnv();
    if (cfEnv) {
      const existing = await cfEnv.DB.prepare(
        "SELECT * FROM categories WHERE slug = ? LIMIT 1"
      )
        .bind(slug)
        .first();

      if (!existing) {
        await cfEnv.DB.prepare(
          "INSERT INTO categories (slug, name, description, hero_image_url) VALUES (?, ?, ?, ?)"
        )
          .bind(
            slug,
            name ?? slug,
            description ?? "",
            hero_image_url ?? ""
          )
          .run();

        return NextResponse.json({ success: true, category: { slug, name, description, hero_image_url } });
      }

      await cfEnv.DB.prepare(
        "UPDATE categories SET name = ?, description = ?, hero_image_url = ? WHERE slug = ?"
      )
        .bind(
          name ?? existing.name ?? slug,
          description ?? existing.description ?? "",
          hero_image_url ?? existing.hero_image_url ?? "",
          slug
        )
        .run();

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Local category updates are unavailable in Edge runtime." },
      { status: 501 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
