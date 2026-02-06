// Cloudflare Workers environment bindings
import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

export interface CloudflareEnv {
  DB: D1Database;
  IMAGES: R2Bucket;
}

// Check if we're running in Cloudflare Workers environment
export function getCloudflareEnv(): CloudflareEnv | null {
  // Prefer global bindings in Workers/Pages
  const globalDb = (globalThis as any).DB;
  const globalImages = (globalThis as any).IMAGES;
  if (globalDb && globalImages) {
    return { DB: globalDb, IMAGES: globalImages };
  }

  // Fallback to process.env if available
  if (typeof process !== "undefined" && process.env) {
    const db = (process.env as any).DB;
    const images = (process.env as any).IMAGES;

    if (db && images) {
      return { DB: db, IMAGES: images };
    }
  }
  
  return null;
}

export function isCloudflareEnvironment(): boolean {
  return getCloudflareEnv() !== null;
}
