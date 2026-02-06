// Cloudflare Workers environment bindings
import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

export interface CloudflareEnv {
  DB: D1Database;
  IMAGES: R2Bucket;
}

// Check if we're running in Cloudflare Workers environment
export function getCloudflareEnv(): CloudflareEnv | null {
  // In Next.js API routes running on Cloudflare Pages,
  // bindings are available via process.env
  if (typeof process !== 'undefined' && process.env) {
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
