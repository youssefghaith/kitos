# 🧪 Testing Guide: Variant Upload Flow

## ✅ Complete Flow (Admin → Website)

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Login to Admin Panel
1. Go to: http://localhost:3000/admin/login
2. Login with your Supabase credentials

### Step 3: Create a Design (if needed)
1. In admin panel, fill out "New design" form:
   - **Name**: e.g., "Nero Signature"
   - **Slug**: e.g., "nero-signature"  
   - **Category**: Marble
   - **Short description**: Brief description
2. Click "Create design"

### Step 4: Upload a Variant
1. Click on the design you just created (left panel)
2. In the "Add variant" form:
   - **Material**: Select (nero/calacatta)
   - **Cloth**: Select (charcoal/blue/green/brown)
   - **Wood accent**: Select (black/walnut)
   - **Image file**: Upload your variant image
3. Click "Save variant"
4. ✅ You should see success message

### Step 5: View on Website
1. Go to: http://localhost:3000/marble
2. You should see your design card
3. Click "Customize this design"
4. Select the material/cloth/wood you just uploaded
5. ✅ **Your uploaded image should appear!**

---

## 🔍 Troubleshooting

### Variant doesn't show up?
1. Check browser console for errors
2. Make sure the design **slug matches** between admin and URL
3. Verify the variant was saved in Supabase:
   - Go to Supabase dashboard
   - Check `variants` table
   - Look for your material/cloth/wood combination

### Image not loading?
- Check the `image_url` in Supabase `variants` table
- If it starts with `/uploads/`, the image is saved locally in `/public/uploads/`
- Make sure the file exists at that path

---

## 📊 Database Structure

### Supabase Tables

**designs**
- `id`: UUID
- `slug`: unique identifier (e.g., "nero-signature")
- `name`: display name
- `category`: marble/wood/hybrid
- `short_description`: brief text
- `hero_image_url`: optional hero image
- `is_featured`: boolean

**variants**
- `id`: UUID
- `design_id`: references designs(id)
- `material`: e.g., "nero", "calacatta"
- `cloth`: e.g., "charcoal", "blue"
- `wood_accent`: e.g., "black", "walnut"
- `image_url`: path to uploaded image
- `created_at`: timestamp

---

## ✅ Everything Working?

You should now have a complete cycle:
1. **Admin uploads** variant → Saved to Supabase
2. **Website fetches** from Supabase → Displays variant
3. **User selects** options → Sees uploaded image

🎉 **Your CMS is working!**
