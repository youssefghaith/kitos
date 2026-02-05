# 🎉 Cloudflare D1 & R2 Integration Complete!

## ✅ What's Been Set Up

### Local Development (Current)
- **Image Storage**: Local file system (`/public/uploads/`)
- **Variant Data**: Static data in `lib/marbleDesigns.ts`
- **Upload Page**: http://localhost:3000/upload-variant
- **Auto-generated code snippets** for manual addition to marbleDesigns.ts

### Cloudflare Production (Ready to Deploy)
- **D1 Database**: `kitos-pool-tables` (f6b245e6-8bc0-4fdb-895b-d7e80b1408f9)
- **R2 Storage**: Bucket name `kitos-table-images` (needs network fix to create)
- **Smart Fallback**: Automatically detects environment and uses appropriate storage

---

## 🚀 How It Works

### Architecture

```
┌─────────────────────────────────────────┐
│         Upload Variant Page             │
│     /upload-variant                     │
└──────────────┬──────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────┐
│      POST /api/upload                    │
│  ┌────────────────────────────────┐     │
│  │ Is Cloudflare Environment?     │     │
│  └────────┬───────────────┬───────┘     │
│           │ YES           │ NO          │
│           ↓               ↓             │
│      Upload to R2    Save locally       │
│      (Production)    (/public/uploads)  │
└──────────────┬──────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────┐
│   POST /api/cloudflare/variants          │
│  ┌────────────────────────────────┐     │
│  │ Is Cloudflare Environment?     │     │
│  └────────┬───────────────┬───────┘     │
│           │ YES           │ NO          │
│           ↓               ↓             │
│      Save to D1      Return code        │
│    (Auto-updates)    snippet for        │
│                      manual add         │
└──────────────────────────────────────────┘
```

---

## 📖 Usage Guide

### Local Development

1. **Start Dev Server**
   ```bash
   npm run dev
   ```

2. **Upload a Variant**
   - Go to: http://localhost:3000/upload-variant
   - Select design, material, cloth, wood accent
   - Upload image
   - Copy the generated code snippet
   - Paste into `lib/marbleDesigns.ts`
   - Restart dev server

3. **View Variants**
   - Go to: http://localhost:3000/marble
   - Select a design
   - Configurator shows all variants

---

### Cloudflare Production Deployment

#### Step 1: Complete R2 Setup (Network Issue Workaround)

Due to network connectivity issues, create the R2 bucket manually:

1. Go to: https://dash.cloudflare.com/
2. Navigate to **R2 Object Storage**
3. Click **"Create bucket"**
4. Name: `kitos-table-images`
5. Click **Create bucket**

Or retry the command when network is stable:
```bash
npx wrangler r2 bucket create kitos-table-images
```

#### Step 2: Push Schema to Remote D1

```bash
npx wrangler d1 execute kitos-pool-tables --remote --file=./schema.sql
```

If network issues persist, run SQL manually in the Cloudflare Dashboard:
1. Go to: https://dash.cloudflare.com/
2. **Workers & Pages** → **D1**
3. Select `kitos-pool-tables`
4. **Console** tab → paste contents of `schema.sql`

#### Step 3: Deploy to Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy .next
```

#### Step 4: Configure R2 Public Access (Optional)

For public R2 URLs, either:
- **Option A**: Enable R2 public access in dashboard
- **Option B**: Set up a custom domain for R2

Update the URL in `app/api/upload/route.ts` line 44:
```typescript
const publicUrl = `https://your-actual-r2-domain.com/${key}`;
```

---

## 🔧 Configuration Files

### `wrangler.toml`
Already configured with:
- D1 database binding (`DB`)
- R2 bucket binding (`IMAGES`)
- Database ID: `f6b245e6-8bc0-4fdb-895b-d7e80b1408f9`

### `schema.sql`
Database schema with:
- `designs` table (pool table designs)
- `variants` table (material/cloth/wood combinations with images)
- Indexes for fast queries

---

## 🎯 Key Features

### ✅ Smart Environment Detection
- Automatically uses R2 + D1 in production
- Falls back to local storage in development
- No code changes needed between environments

### ✅ Automatic Variant Management
- **Production**: Upload → saves to D1 automatically
- **Development**: Upload → generates code snippet

### ✅ No Breaking Changes
- Existing local workflow still works
- Can gradually migrate to Cloudflare
- Fallback to local data if API fails

---

## 📁 File Structure

```
app/
├── api/
│   ├── upload/route.ts              # Image upload (R2 or local)
│   └── cloudflare/
│       ├── designs/route.ts         # Fetch designs from D1
│       └── variants/route.ts        # Fetch/save variants to D1
├── upload-variant/page.tsx          # Upload UI
└── marble/page.tsx                  # Uses local data

lib/
├── cloudflare.ts                    # Environment detection
├── marbleDesigns.ts                 # Local fallback data
└── designsData.ts                   # D1 data fetching helpers

public/
└── uploads/                         # Local image storage
    └── {design-slug}/
        └── {timestamp}_{filename}
```

---

## 🧪 Testing

### Test Local Flow
```bash
npm run dev
# Visit http://localhost:3000/upload-variant
# Upload an image
# Should get code snippet
```

### Test API Endpoints
```bash
# Designs API
curl http://localhost:3000/api/cloudflare/designs

# Variants API
curl "http://localhost:3000/api/cloudflare/variants?design_slug=nero-signature"
```

---

## 🔮 Next Steps

1. **Fix R2 bucket creation** (network issue)
2. **Deploy to Cloudflare Pages**
3. **Configure R2 custom domain** for public URLs
4. **Test end-to-end** on production
5. **Optional**: Add authentication to upload page

---

## 📝 Notes

- **Database ID**: `f6b245e6-8bc0-4fdb-895b-d7e80b1408f9`
- **Bucket Name**: `kitos-table-images`
- **Region**: EEUR (Eastern Europe)
- **Local D1**: Already working at `.wrangler/state/v3/d1`

Your site is now ready for both local development and Cloudflare production! 🎉
