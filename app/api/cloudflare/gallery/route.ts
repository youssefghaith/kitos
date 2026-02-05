import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { join } from "path";
import { getCloudflareEnv } from "@/lib/cloudflare";

type GalleryItem = {
  id: string;
  title: string;
  type: string;
  image_url: string;
  sort_order?: number;
};

type LocalDb = {
  gallery?: GalleryItem[];
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

export async function GET() {
  try {
    const cfEnv = getCloudflareEnv();
    if (cfEnv) {
      const results = await cfEnv.DB.prepare(
        "SELECT * FROM gallery ORDER BY sort_order ASC, created_at DESC"
      ).all();
      return NextResponse.json({ items: results.results ?? [] });
    }

    const localDb = await readLocalDb();
    const items = localDb.gallery ?? [];
    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, type, image_url, sort_order } = body as GalleryItem;

    if (!title || !type || !image_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = randomUUID();
    const cfEnv = getCloudflareEnv();
    if (cfEnv) {
      await cfEnv.DB.prepare(
        "INSERT INTO gallery (id, title, type, image_url, sort_order) VALUES (?, ?, ?, ?, ?)"
      )
        .bind(id, title, type, image_url, sort_order ?? 0)
        .run();
      return NextResponse.json({ success: true, item: { id, title, type, image_url, sort_order } });
    }

    const localDb = await readLocalDb();
    const items = localDb.gallery ?? [];
    items.unshift({ id, title, type, image_url, sort_order: sort_order ?? 0 });
    localDb.gallery = items;
    await writeLocalDb(localDb);
    return NextResponse.json({ success: true, item: { id, title, type, image_url, sort_order } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, type, image_url, sort_order } = body as GalleryItem;

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const cfEnv = getCloudflareEnv();
    if (cfEnv) {
      await cfEnv.DB.prepare(
        "UPDATE gallery SET title = ?, type = ?, image_url = ?, sort_order = ? WHERE id = ?"
      )
        .bind(title ?? null, type ?? null, image_url ?? null, sort_order ?? 0, id)
        .run();
      return NextResponse.json({ success: true });
    }

    const localDb = await readLocalDb();
    const items = localDb.gallery ?? [];
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const existing = items[index];
    items[index] = {
      ...existing,
      title: title ?? existing.title,
      type: type ?? existing.type,
      image_url: image_url ?? existing.image_url,
      sort_order: typeof sort_order === "number" ? sort_order : existing.sort_order ?? 0,
    };
    localDb.gallery = items;
    await writeLocalDb(localDb);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const cfEnv = getCloudflareEnv();
    if (cfEnv) {
      await cfEnv.DB.prepare("DELETE FROM gallery WHERE id = ?").bind(id).run();
      return NextResponse.json({ success: true });
    }

    const localDb = await readLocalDb();
    localDb.gallery = (localDb.gallery ?? []).filter((i) => i.id !== id);
    await writeLocalDb(localDb);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
