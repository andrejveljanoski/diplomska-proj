# 🚀 Getting Started - Complete Setup Checklist

Follow these steps in order to get R2 image storage and admin features working.

## ✅ Step 1: Get Cloudflare R2 Credentials

1. Go to https://dash.cloudflare.com/
2. Click "R2" in the left sidebar
3. Click "Create bucket"
4. Name it: `macedonia-images` (or your choice)
5. Click "Create bucket"

6. Go to "Manage R2 API Tokens"
7. Click "Create API Token"
8. Choose **"Object Read & Write"** permission
9. Select your bucket
10. Click "Create API Token"
11. **Save these values** (you won't see them again):
   - Access Key ID
   - Secret Access Key

12. Go back to your bucket settings
13. Click "Settings" tab
14. Under "Public Access", enable public bucket
15. Copy the **Public URL** (looks like `https://pub-xxxxx.r2.dev`)

16. Get your Account ID:
   - Look at the URL in your browser
   - Format: `https://dash.cloudflare.com/<ACCOUNT_ID>/r2/...`
   - Or find it in R2 > Settings

## ✅ Step 2: Configure Environment Variables

1. Create or update `.env.local` in your project root:

```env
# Replace these with your actual values from Step 1

# Format: https://<YOUR_ACCOUNT_ID>.r2.cloudflarestorage.com
R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com

# From API Token creation
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here

# Your bucket name
R2_BUCKET_NAME=macedonia-images

# Public URL from bucket settings
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev

# Your existing env vars (keep these)
DATABASE_URL=your_existing_database_url
NEXTAUTH_SECRET=your_existing_secret
NEXTAUTH_URL=http://localhost:3000
```

2. **Restart your dev server** after adding these variables

## ✅ Step 3: Update Database Schema

Run this command to add the `is_admin` column to your users table:

```bash
pnpm db:push
```

You should see output confirming the schema was pushed.

## ✅ Step 4: Make Yourself an Admin

You need to set your user account as admin. Choose one method:

### Method A: Using Drizzle Studio (Recommended)

```bash
pnpm db:studio
```

1. Opens in your browser at http://localhost:4983
2. Click on the `users` table
3. Find your user (by email)
4. Click to edit
5. Set `is_admin` to `true`
6. Save

### Method B: Using SQL (if you have database access)

Connect to your Neon database and run:

```sql
UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';
```

Replace `your-email@example.com` with your actual email.

## ✅ Step 5: Test the Setup

1. **Start your dev server** (if not running):
   ```bash
   pnpm dev
   ```

2. **Log in** to your app with your admin account

3. **Navigate to any region page**
   - Example: http://localhost:3000/regions/skopje

4. **Look for the "Edit Region" button**
   - Should appear in the top right (next to "Back to Map")
   - If you don't see it, check that:
     - You're logged in
     - Your user has `is_admin = true` in the database
     - You've restarted the dev server after setting environment variables

5. **Try uploading an image**:
   - Click "Edit Region"
   - Update some text fields
   - Click the file input and select an image
   - Click "Update Region"
   - If successful, you'll see a success toast message
   - The page will reload with the new image

## ✅ Step 6: Bulk Upload Images (Optional)

If you have 80 images ready to upload, you have options:

### Option 1: Manual Upload via Cloudflare Dashboard

1. Go to your bucket in Cloudflare dashboard
2. Click "Upload"
3. Drag and drop all your images
4. Organize them in folders if you want (e.g., `regions/`)
5. Copy each public URL
6. Update each region in your app using the Edit Region form

### Option 2: Use the Admin UI

1. Go to each region page
2. Click "Edit Region"
3. Upload the image for that region
4. Repeat for all regions

### Option 3: Programmatic Bulk Upload (Fastest for many images)

1. Create a folder `temp-images/` in your project
2. Put all images there, named by region code (e.g., `skopje.jpg`, `bitola.jpg`)
3. Create a script (see `R2_SETUP_GUIDE.md` for the full code)
4. Run: `tsx lib/db/upload-images.ts`

## 🎉 You're Done!

Your app now has:
- ✅ Images stored on Cloudflare R2 (fast CDN delivery)
- ✅ Admin interface to edit regions
- ✅ Image upload functionality
- ✅ No need to edit database directly

## 🐛 Troubleshooting

### "Edit Region" button not showing
- Check you're logged in
- Verify `is_admin = true` in database
- Restart dev server
- Clear browser cache

### Image upload fails
- Check environment variables are correct
- Verify R2 API token has "Object Read & Write" permissions
- Check browser console for errors
- Verify file size is reasonable (<10MB)

### Images not loading
- Enable public access on R2 bucket
- Check `R2_PUBLIC_URL` is correct in `.env.local`
- Look for CORS errors in browser console
- Verify image URL in database is correct

### Can't push database changes
- Check `DATABASE_URL` is correct
- Ensure you have write permissions to database
- Try running `pnpm db:generate` first, then `pnpm db:push`

## 📚 Additional Documentation

- **R2_SETUP_GUIDE.md** - Detailed setup and advanced usage
- **IMPLEMENTATION_SUMMARY.md** - Technical details of what was built
- **.env.example** - Template for environment variables

## 🆘 Need Help?

Check the error messages carefully - they usually point to:
1. Missing environment variables
2. Wrong API permissions
3. Database connection issues
4. Session/authentication problems

Make sure to follow the steps in order!
