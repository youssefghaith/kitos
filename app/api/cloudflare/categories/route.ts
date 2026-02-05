import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { getCloudflareEnv } from "@/lib/cloudflare";

type LocalCategory = {
  slug: string;
  name: string;
  description?: string;
  hero_image_url?: string;
};

type LocalDb = {
  categories?: LocalCategory[];
  designs?: any[];
  variants?: any[];
};

const LOCAL_DB_PATH = join(process.cwd(), "data", "local-db.json");

const DEFAULT_CATEGORIES: LocalCategory[] = [
  { slug: "marble", name: "Marble", description: "", hero_image_url: "" },
  { slug: "wood", name: "Wood", description: "", hero_image_url: "" },
  { slug: "hybrid", name: "Hybrid", description: "", hero_image_url: "" },
];

async function readLocalDb(): Promise<LocalDb> {
  const { readFile } = await import("fs/promises");
  const raw = await readFile(LOCAL_DB_PATH, "utf-8");
  const db = JSON.parse(raw) as LocalDb;
  if (!db.categories || db.categories.length === 0) {
    db.categories = DEFAULT_CATEGORIES;
    await writeLocalDb(db);
  }
  return db;
}

async function writeLocalDb(db: LocalDb) {
  const { writeFile } = await import("fs/promises");
  await writeFile(LOCAL_DB_PATH, JSON.stringify(db, null, 2));
}

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

    const localDb = await readLocalDb();
    const categories = localDb.categories ?? DEFAULT_CATEGORIES;

    if (slug) {
      const category = categories.find((c) => c.slug === slug);
      return NextResponse.json({ category });
    }

    return NextResponse.json({ categories });
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

    const localDb = await readLocalDb();
    const categories = localDb.categories ?? DEFAULT_CATEGORIES;
    const index = categories.findIndex((c) => c.slug === slug);
    if (index === -1) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const existing = categories[index];
    const updated = {
      ...existing,
      name: name ?? existing.name,
      description: description ?? existing.description,
      hero_image_url: hero_image_url ?? existing.hero_image_url,
    };

    categories[index] = updated;
    localDb.categories = categories;
    await writeLocalDb(localDb);

    return NextResponse.json({ success: true, category: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
