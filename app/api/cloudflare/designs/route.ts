import { NextRequest, NextResponse } from "next/server";
import { getCloudflareEnv } from "@/lib/cloudflare";
import { MARBLE_DESIGNS } from "@/lib/marbleDesigns";

export const runtime = "edge";

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
    const id = crypto.randomUUID();
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

    return NextResponse.json(
      { error: "D1 is not configured in this environment." },
      { status: 500 }
    );
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

    return NextResponse.json(
      { error: "D1 is not configured in this environment." },
      { status: 500 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
