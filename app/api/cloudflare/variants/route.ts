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
    const designSlug = searchParams.get("design_slug");

    if (!designSlug) {
      return NextResponse.json({ error: "design_slug required" }, { status: 400 });
    }

    const cfEnv = getCloudflareEnv();
    
    if (cfEnv) {
      // Fetch from D1
      try {
        const results = await cfEnv.DB.prepare(
          "SELECT * FROM variants WHERE design_id = (SELECT id FROM designs WHERE slug = ?)"
        )
          .bind(designSlug)
          .all();

        const normalized = (results.results || []).map((row: any) => ({
          ...row,
          options: row.options ? JSON.parse(row.options) : {
            material: row.material,
            cloth: row.cloth,
            wood_accent: row.wood_accent,
          },
        }));

        return NextResponse.json({ variants: normalized });
      } catch (d1Error) {
        console.error("D1 query failed:", d1Error);
      }
    }

    // Local dev fallback (file-backed)
    try {
      const localDb = await readLocalDb();
      const variants = (localDb.variants ?? []).filter(
        (v) => v.design_slug === designSlug
      );
      if (variants.length > 0) {
        const normalized = variants.map((v: any) => ({
          ...v,
          options:
            v.options ??
            {
              material: v.material,
              cloth: v.cloth,
              wood_accent: v.wood_accent,
            },
        }));
        return NextResponse.json({ variants: normalized, source: "local-file" });
      }
    } catch {
      // ignore and fall back to static data
    }

    // Fallback to static data
    const design = MARBLE_DESIGNS.find((d) => d.slug === designSlug);
    const variants = design?.variants || [];

    const normalized = variants.map((v: any) => ({
      ...v,
      options: {
        material: v.material,
        cloth: v.cloth,
        wood_accent: v.wood,
      },
      image_url: v.image,
    }));

    return NextResponse.json({ variants: normalized });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { design_slug, material, cloth, wood_accent, image_url, options } = body;

    if (!design_slug || !image_url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = randomUUID();
    const cfEnv = getCloudflareEnv();

    if (cfEnv) {
      // Save to D1
      try {
        // First get the design ID
        const designResult = await cfEnv.DB.prepare(
          "SELECT id FROM designs WHERE slug = ?"
        )
          .bind(design_slug)
          .first();

        if (!designResult) {
          // Create design if it doesn't exist
          const designId = randomUUID();
          await cfEnv.DB.prepare(
            "INSERT INTO designs (id, slug, name, category, is_featured) VALUES (?, ?, ?, ?, 1)"
          )
            .bind(designId, design_slug, design_slug, "marble")
            .run();

          // Insert variant
          await cfEnv.DB.prepare(
            "INSERT INTO variants (id, design_id, material, cloth, wood_accent, image_url, options) VALUES (?, ?, ?, ?, ?, ?, ?)"
          )
            .bind(
              id,
              designId,
              material ?? "",
              cloth ?? "",
              wood_accent ?? "",
              image_url,
              options ? JSON.stringify(options) : null
            )
            .run();

          // Auto-set hero image if empty
          await cfEnv.DB.prepare(
            "UPDATE designs SET hero_image_url = ? WHERE id = ? AND (hero_image_url IS NULL OR hero_image_url = '')"
          )
            .bind(image_url, designId)
            .run();
        } else {
          // Insert variant with existing design
          await cfEnv.DB.prepare(
            "INSERT INTO variants (id, design_id, material, cloth, wood_accent, image_url, options) VALUES (?, ?, ?, ?, ?, ?, ?)"
          )
            .bind(
              id,
              designResult.id,
              material ?? "",
              cloth ?? "",
              wood_accent ?? "",
              image_url,
              options ? JSON.stringify(options) : null
            )
            .run();

          // Auto-set hero image if empty
          await cfEnv.DB.prepare(
            "UPDATE designs SET hero_image_url = ? WHERE id = ? AND (hero_image_url IS NULL OR hero_image_url = '')"
          )
            .bind(image_url, designResult.id)
            .run();
        }

        return NextResponse.json({
          success: true,
          variant: { id, design_slug, material, cloth, wood_accent, image_url, options },
          storage: "d1",
        });
      } catch (d1Error) {
        console.error("D1 insert failed:", d1Error);
        return NextResponse.json(
          { error: "Database error", details: (d1Error as Error).message },
          { status: 500 }
        );
      }
    }

    // Local dev fallback: persist to file
    const localDb = await readLocalDb();
    localDb.variants = [
      ...(localDb.variants ?? []),
      {
        id,
        design_slug,
        material: material ?? "",
        cloth: cloth ?? "",
        wood_accent: wood_accent ?? "",
        image_url,
        options: options ?? null,
      },
    ];

    // Auto-set hero image if empty
    const designIndex = (localDb.designs ?? []).findIndex((d) => d.slug === design_slug);
    if (designIndex !== -1) {
      const existing = localDb.designs[designIndex];
      if (!existing.hero_image_url) {
        localDb.designs[designIndex] = {
          ...existing,
          hero_image_url: image_url,
        };
      }
    }

    await writeLocalDb(localDb);

    return NextResponse.json({
      success: true,
      variant: { id, design_slug, material, cloth, wood_accent, image_url, options },
      storage: "local-file",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
