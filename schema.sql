-- D1 Database Schema for KITOS Pool Table Site

-- Categories table: stores category hero images and descriptions
CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  hero_image_url TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Gallery table: stores curated project images
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Designs table: stores pool/marble table designs
CREATE TABLE IF NOT EXISTS designs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('marble', 'wood', 'hybrid')),
  short_description TEXT,
  hero_image_url TEXT,
  option_groups TEXT,
  is_featured INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Variants table: stores specific material/cloth/wood combinations with images
CREATE TABLE IF NOT EXISTS variants (
  id TEXT PRIMARY KEY,
  design_id TEXT NOT NULL,
  material TEXT NOT NULL,
  cloth TEXT NOT NULL,
  wood_accent TEXT NOT NULL,
  image_url TEXT NOT NULL,
  options TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (design_id) REFERENCES designs(id) ON DELETE CASCADE
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_variants_design_id ON variants(design_id);
CREATE INDEX IF NOT EXISTS idx_designs_category_featured ON designs(category, is_featured);
