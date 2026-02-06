import { NextRequest, NextResponse } from "next/server";
import { getCloudflareEnv } from "@/lib/cloudflare";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const designSlug = formData.get("designSlug") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!designSlug) {
      return NextResponse.json({ error: "No design slug provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const safeName = file.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9._-]/g, "");

    const filename = `${Date.now()}_${safeName}`;

    // Try Cloudflare R2 first
    const cfEnv = getCloudflareEnv();
    if (cfEnv) {
      try {
        const key = `${designSlug}/${filename}`;
        await cfEnv.IMAGES.put(key, buffer, {
          httpMetadata: {
            contentType: file.type,
          },
        });

        // R2 public URL (set R2_PUBLIC_BASE_URL in Cloudflare Pages env vars)
        const baseUrl = process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, "");
        const publicUrl = baseUrl ? `${baseUrl}/${key}` : null;

        return NextResponse.json({
          success: true,
          url: publicUrl ?? `/uploads/${designSlug}/${filename}`,
          filename,
          storage: "r2",
        });
      } catch (r2Error) {
        console.error("R2 upload failed, falling back to local:", r2Error);
      }
    }

    return NextResponse.json(
      { error: "R2 is not configured in this environment." },
      { status: 500 }
    );
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
