# Cloudflare D1 & R2 Setup Guide

## Prerequisites
1. A Cloudflare account (free tier works)
2. Wrangler CLI installed (already done via npm)

## Step 1: Login to Cloudflare

```bash
npx wrangler login
```

This will open a browser window to authenticate.

## Step 2: Create D1 Database

```bash
npx wrangler d1 create kitos-pool-tables
```

**IMPORTANT**: Copy the `database_id` from the output and update `wrangler.toml`:
- Replace `YOUR_DATABASE_ID` with the actual ID

## Step 3: Initialize Database Schema

```bash
npx wrangler d1 execute kitos-pool-tables --file=./schema.sql
```

This creates the `designs` and `variants` tables.

## Step 4: Create R2 Bucket

```bash
npx wrangler r2 bucket create kitos-table-images
```

## Step 5: Get Account ID

```bash
npx wrangler whoami
```

Copy your **Account ID** from the output.

## Step 6: Update Environment Variables

Create or update `.env.local` with:

```env
# Cloudflare Configuration
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_API_TOKEN=your_api_token_here
CLOUDFLARE_D1_DATABASE_ID=your_database_id_here
CLOUDFLARE_R2_BUCKET_NAME=kitos-table-images

# Optional: Keep Supabase for auth only
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 7: Create API Token

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use template "Edit Cloudflare Workers" OR create custom with:
   - Account / D1 / Edit
   - Account / Workers R2 Storage / Edit
4. Copy the token to `.env.local` as `CLOUDFLARE_API_TOKEN`

## Verification

After setup, verify:
```bash
npx wrangler d1 execute kitos-pool-tables --command="SELECT * FROM designs"
npx wrangler r2 bucket list
```

You're now ready to use Cloudflare D1 and R2!
