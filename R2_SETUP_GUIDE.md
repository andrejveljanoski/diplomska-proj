# R2 Setup and Admin Features Guide

This guide explains how to set up Cloudflare R2 for image storage and use the admin features to manage regions.

## 1. R2 Setup

### Environment Variables

Add these to your `.env.local` file:

```env
R2_ENDPOINT=https://<your-account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_access_key_id_from_cloudflare
R2_SECRET_ACCESS_KEY=your_secret_access_key_from_cloudflare
R2_BUCKET_NAME=macedonia-images
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### How to get these values:

1. **R2_ENDPOINT**: From Cloudflare dashboard > R2 > Settings > Find your account ID. Format: `https://<account-id>.r2.cloudflarestorage.com`

2. **R2_ACCESS_KEY_ID & R2_SECRET_ACCESS_KEY**: The credentials you generated in step 4 (the API token)

3. **R2_BUCKET_NAME**: The name you chose when creating the bucket (e.g., `macedonia-images`)

4. **R2_PUBLIC_URL**: 
   - In your bucket settings, click "Settings"
   - Under "Public Access", enable public access
   - You'll get a public URL like `https://pub-xxxxx.r2.dev`
   - Or set up a custom domain for better URLs

## 2. Database Migration

After updating the schema to include the `isAdmin` field, push the changes to your database:

```bash
pnpm db:push
```

## 3. Create an Admin User

You need to manually set a user as admin in the database:

1. Open Drizzle Studio:
```bash
pnpm db:studio
```

2. Find your user in the `users` table
3. Set `is_admin` to `true` for your account

Alternatively, update via SQL:
```sql
UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';
```

## 4. Using the Admin Features

### On Individual Region Pages

1. Log in with an admin account
2. Navigate to a region page (e.g., `/regions/skopje`)
3. You'll see an "Edit Region" button (only visible to admins)
4. Click to open the editor dialog

### Editing Region Information

The admin editor allows you to:
- Update region name
- Change population
- Modify descriptions (short and full)
- Update places to visit (comma-separated list)
- Upload a new region image

### Uploading Images to R2

When you select an image file in the editor:
1. The image is uploaded to R2 when you submit the form
2. It's stored in a folder structure: `regions/{region-code}/{timestamp}-{filename}`
3. The public URL is automatically saved to the database
4. The image will be served from R2's CDN

## 5. Using Images in Components

Update your region card or any component to use R2 images:

```tsx
<Image
  src={region.image || "/images/mkd.png"} // Fallback to default
  alt={region.name}
  fill
  sizes="(max-width: 768px) 100vw, 448px"
  className="object-cover"
/>
```

## 6. Image Upload Workflow

### Manual Upload (via Cloudflare Dashboard)
1. Go to your bucket in the Cloudflare dashboard
2. Click "Upload"
3. Drag and drop images
4. Copy the public URL
5. Update the region in the database with the image URL

### Programmatic Upload (via Admin UI)
1. Use the "Edit Region" button on any region page
2. Select an image file
3. Submit the form
4. The app automatically:
   - Uploads to R2
   - Updates the database
   - Serves the new image

## 7. Bulk Image Upload (Optional)

If you want to upload all 80 images at once:

### Option 1: Cloudflare Dashboard
- Zip your images
- Upload via the dashboard
- Manually update database with URLs

### Option 2: Script (Recommended for bulk)

Create a script `lib/db/upload-images.ts`:

```typescript
import { uploadImageToR2, generateRegionImageKey } from "@/lib/r2";
import { db } from "@/lib/db";
import { regions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

async function uploadRegionImages() {
  const imagesDir = path.join(process.cwd(), "temp-images");
  const files = fs.readdirSync(imagesDir);

  for (const file of files) {
    // Assuming filename format: regionCode.jpg
    const regionCode = file.split(".")[0];
    const filePath = path.join(imagesDir, file);
    const buffer = fs.readFileSync(filePath);
    
    const key = generateRegionImageKey(regionCode, file);
    const imageUrl = await uploadImageToR2(buffer, key, "image/jpeg");
    
    await db.update(regions)
      .set({ image: imageUrl })
      .where(eq(regions.code, regionCode));
    
    console.log(`Uploaded: ${regionCode}`);
  }
}

uploadRegionImages().then(() => console.log("Done!"));
```

Run with: `tsx lib/db/upload-images.ts`

## 8. Security Notes

- Admin routes check `session.user.isAdmin` before allowing edits
- Only authenticated admins can upload images
- Only authenticated admins can update region data
- Regular users can only view data

## 9. Next Steps

1. Set up your R2 bucket and get credentials
2. Add environment variables to `.env.local`
3. Push database changes: `pnpm db:push`
4. Set your user as admin in the database
5. Test uploading an image on a region page
6. Bulk upload remaining images using one of the methods above

## Troubleshooting

### Images not loading
- Check that public access is enabled on your R2 bucket
- Verify R2_PUBLIC_URL is correct
- Check browser console for CORS errors

### Upload fails
- Verify API token has "Object Read & Write" permissions
- Check environment variables are set correctly
- Ensure file size is reasonable (<10MB recommended)

### Admin button not showing
- Verify you're logged in
- Check that `is_admin` is `true` in the database
- Clear browser cache and session
