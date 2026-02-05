# Managing Table Variants (Cloudflare)

## Current Setup

This project uses **Cloudflare D1** for variant metadata and **Cloudflare R2** for images. The admin panel at `/admin` lets you add designs and upload variant images directly.

## Recommended Workflow

1. **Protect the admin** with Cloudflare Access (restrict `/admin` and `/upload-variant`).
2. **Upload variants** in the admin UI.
3. **Verify** the variant appears in the configurator.

## Local Dev Notes

- The app falls back to static data from `lib/marbleDesigns.ts` if D1/R2 isn’t available.
- For local uploads (no R2), files are saved to `public/uploads/{designSlug}/`.

## R2 Public URL

Set this env var in Cloudflare Pages:

- `R2_PUBLIC_BASE_URL` = your public bucket URL (example: `https://<bucket>.r2.dev`)

This is used to construct public image URLs after upload.

## Admin Panel

The admin panel at `/admin` can:
- Create designs
- Upload variants and store metadata in D1

If Cloudflare Access is enabled, the app itself does not require a login screen.
