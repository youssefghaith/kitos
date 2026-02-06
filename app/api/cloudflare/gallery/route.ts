import { NextRequest, NextResponse } from "next/server";
import { getCloudflareEnv } from "@/lib/cloudflare";

export const runtime = "edge";

type GalleryItem = {
  id: string;
  title: string;
  type: string;
  image_url: string;
  sort_order?: number;
};

export async function GET() {
  try {
    const cfEnv = getCloudflareEnv();
    if (cfEnv) {
      const results = await cfEnv.DB.prepare(
        "SELECT * FROM gallery ORDER BY sort_order ASC, created_at DESC"
      ).all();
      return NextResponse.json({ items: results.results ?? [] });
    }
    return NextResponse.json({ items: [] });
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

    const id = crypto.randomUUID();
    const cfEnv = getCloudflareEnv();
    if (cfEnv) {
      await cfEnv.DB.prepare(
        "INSERT INTO gallery (id, title, type, image_url, sort_order) VALUES (?, ?, ?, ?, ?)"
      )
        .bind(id, title, type, image_url, sort_order ?? 0)
        .run();
      return NextResponse.json({ success: true, item: { id, title, type, image_url, sort_order } });
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

    return NextResponse.json(
      { error: "D1 is not configured in this environment." },
      { status: 500 }
    );
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

    return NextResponse.json(
      { error: "D1 is not configured in this environment." },
      { status: 500 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
