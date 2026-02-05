import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { join } from "path";
import { getCloudflareEnv } from "@/lib/cloudflare";
import { MARBLE_DESIGNS } from "@/lib/marbleDesigns";

type LocalDb = {
  designs: any[];
  variants: any[];
};

const LOCAL_DB_PATH = join(process.cwd(), "data", "local-db.json");

async function readLocalDb(): Promise<LocalDb> {
  const { readFile } = await import("fs/promises");
  const raw = await readFile(LOCAL_DB_PATH, "utf-8");
  return JSON.parse(raw) as LocalDb;
}

async function writeLocalDb(db: LocalDb) {
  const { writeFile } = await import("fs/promises");
  await writeFile(LOCAL_DB_PATH, JSON.stringify(db, null, 2));
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "1";
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const cfEnv = getCloudflareEnv();

    if (cfEnv) {
      // Fetch from D1
      try {
        let query =
          "SELECT * FROM designs";
        const filters: string[] = [];
        const bindings: string[] = [];

        if (!all) {
          const selectedCategory = category ?? "marble";
          filters.push("category = ?");
          bindings.push(selectedCategory);
        }

        if (featured === "1" || (!all && featured !== "0")) {
          filters.push("is_featured = 1");
        }

        if (filters.length > 0) {
          query += ` WHERE ${filters.join(" AND ")}`;
        }

        query += " ORDER BY created_at";

        const stmt = cfEnv.DB.prepare(query);
        const results = bindings.length > 0 ? await stmt.bind(...bindings).all() : await stmt.all();

        if (results.results && results.results.length > 0) {
          if (all) {
            const parsed = results.results.map((row: any) => ({
              ...row,
              option_groups: row.option_groups ? JSON.parse(row.option_groups) : [],
            }));
            return NextResponse.json({ designs: parsed, source: "d1" });
          }

          // Transform D1 results to match MarbleDesign format
          const designs = results.results.map((row: any) => ({
            slug: row.slug,
            name: row.name,
            heroImage: row.hero_image_url || "/homepage/marble/marble-1.png",
            description: row.short_description || "",
            variants: [], // Variants are fetched separately
          }));

          return NextResponse.json({ designs, source: "d1" });
        }
      } catch (d1Error) {
        console.error("D1 query failed:", d1Error);
      }
    }

    // Local dev fallback (file-backed). If empty, fall back to static data.
    try {
      const localDb = await readLocalDb();
      let designs = localDb.designs ?? [];

      if (!all) {
        const selectedCategory = category ?? "marble";
        designs = designs.filter((d) => d.category === selectedCategory);
      }

      if (featured === "1" || (!all && featured !== "0")) {
        designs = designs.filter((d) => d.is_featured);
      }

      if (designs.length > 0) {
        if (all) {
          return NextResponse.json({ designs, source: "local-file" });
        }

        const mapped = designs.map((row: any) => ({
          slug: row.slug,
          name: row.name,
          heroImage: row.hero_image_url || "/homepage/marble/marble-1.png",
          description: row.short_description || "",
          variants: [],
        }));

        return NextResponse.json({ designs: mapped, source: "local-file" });
      }
    } catch {
      // ignore and fall back to static data
    }

    // Fallback to static data
    return NextResponse.json({ designs: MARBLE_DESIGNS, source: "local" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, category, short_description, hero_image_url, is_featured, option_groups } =
      body;

    if (!name || !slug || !category) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, category" },
        { status: 400 }
      );
    }

    const cfEnv = getCloudflareEnv();
    const id = randomUUID();
    if (cfEnv) {
      await cfEnv.DB.prepare(
        "INSERT INTO designs (id, slug, name, category, short_description, hero_image_url, is_featured, option_groups) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      )
        .bind(
          id,
          slug,
          name,
          category,
          short_description ?? null,
          hero_image_url ?? null,
          is_featured ? 1 : 0,
          Array.isArray(option_groups) ? JSON.stringify(option_groups) : null
        )
        .run();

      return NextResponse.json({
        success: true,
        design: {
          id,
          slug,
          name,
          category,
          short_description: short_description ?? null,
          hero_image_url: hero_image_url ?? null,
          is_featured: Boolean(is_featured),
          option_groups: Array.isArray(option_groups) ? option_groups : [],
        },
        storage: "d1",
      });
    }

    // Local dev fallback: persist to file
    const localDb = await readLocalDb();
    const design = {
      id,
      slug,
      name,
      category,
      short_description: short_description ?? null,
      hero_image_url: hero_image_url ?? null,
      is_featured: Boolean(is_featured),
      option_groups: Array.isArray(option_groups) ? option_groups : [],
      created_at: new Date().toISOString(),
    };
    localDb.designs = [...(localDb.designs ?? []), design];
    await writeLocalDb(localDb);

    return NextResponse.json({
      success: true,
      design,
      storage: "local-file",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, hero_image_url, short_description, option_groups, name, category, is_featured } =
      body;

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    const cfEnv = getCloudflareEnv();
    if (cfEnv) {
      const existing = await cfEnv.DB.prepare(
        "SELECT * FROM designs WHERE slug = ?"
      )
        .bind(slug)
        .first();

      if (!existing) {
        return NextResponse.json({ error: "Design not found" }, { status: 404 });
      }

      await cfEnv.DB.prepare(
        "UPDATE designs SET name = ?, category = ?, short_description = ?, hero_image_url = ?, is_featured = ?, option_groups = ? WHERE slug = ?"
      )
        .bind(
          name ?? existing.name ?? null,
          category ?? existing.category ?? null,
          short_description ?? existing.short_description ?? null,
          hero_image_url ?? existing.hero_image_url ?? null,
          typeof is_featured === "boolean" ? (is_featured ? 1 : 0) : existing.is_featured ?? 1,
          Array.isArray(option_groups)
            ? JSON.stringify(option_groups)
            : existing.option_groups ?? null,
          slug
        )
        .run();

      return NextResponse.json({ success: true, storage: "d1" });
    }

    const localDb = await readLocalDb();
    const designs = localDb.designs ?? [];
    const index = designs.findIndex((d: any) => d.slug === slug);
    if (index === -1) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    const existing = designs[index];
    const updated = {
      ...existing,
      name: name ?? existing.name,
      category: category ?? existing.category,
      short_description: short_description ?? existing.short_description,
      hero_image_url: hero_image_url ?? existing.hero_image_url,
      is_featured: typeof is_featured === "boolean" ? is_featured : existing.is_featured,
      option_groups: Array.isArray(option_groups) ? option_groups : existing.option_groups ?? [],
    };

    designs[index] = updated;
    localDb.designs = designs;
    await writeLocalDb(localDb);

    return NextResponse.json({ success: true, design: updated, storage: "local-file" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
