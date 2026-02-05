# Variant Upload Guide (Cloudflare)

## ✅ Recommended Flow (Admin Panel)

### 1. Start the Dev Server

```bash
npm run dev
```

### 2. Open the Admin Panel

Navigate to: **http://localhost:3000/admin**

(When deployed, protect `/admin` with Cloudflare Access.)

### 3. Upload a Variant

1. Select a **Design**
2. Choose **Material / Cloth / Wood Accent**
3. Upload your image file
4. Click **Save variant**

This stores metadata in **D1** and uploads images to **R2** (if configured).

---

## Alternative: Upload Variant Page

You can also use the simplified page at:

**http://localhost:3000/upload-variant**

It uploads an image and returns a code snippet for manual use in `lib/marbleDesigns.ts` if D1 isn’t available.

---

## R2 Public URL

Set this env var in Cloudflare Pages:

- `R2_PUBLIC_BASE_URL` = your public bucket URL (example: `https://<bucket>.r2.dev`)

This is used to generate the public image URL returned by the upload API.

---

## Local Storage Fallback

If R2 isn’t configured, uploads are saved to:

```
/public/uploads/{design-slug}/
```

Accessible at:

```
/uploads/{design-slug}/{filename}
```
