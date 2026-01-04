# Quick Reference - What Was Implemented

## Summary
Added Cloudflare R2 integration for image storage and admin functionality to manage regions without direct database access.

## New Files Created

### 1. `lib/r2.ts`
- R2 client configuration using AWS SDK
- Functions: `uploadImageToR2()`, `deleteImageFromR2()`, `generateRegionImageKey()`
- Handles all R2 operations

### 2. `app/api/upload/route.ts`
- API endpoint for uploading images to R2
- Admin-only access
- Accepts FormData with file and regionCode

### 3. `app/api/regions/[code]/update/route.ts`
- API endpoint for updating region data
- Admin-only access
- Validates input with Zod schema
- Updates: name, population, descriptions, image, placesToVisit

### 4. `components/ui/admin-region-editor.tsx`
- Admin UI dialog component for editing regions
- Form for all region fields
- Image upload integration
- Only visible to admin users

### 5. `.env.example`
- Template for required environment variables
- Documents R2 configuration needed

### 6. `R2_SETUP_GUIDE.md`
- Complete setup instructions
- Troubleshooting guide
- Bulk upload options

## Modified Files

### 1. `lib/db/schema.ts`
- Added `isAdmin: boolean` field to users table

### 2. `lib/auth.ts`
- Added `isAdmin` to JWT token
- Added `isAdmin` to session object
- Returns `isAdmin` in authorize callback

### 3. `app/regions/[code]/page.tsx`
- Imported AdminRegionEditor component
- Added admin editor button next to back button
- Only visible to admin users

### 4. `components/ui/region-card.tsx`
- Updated to use `region.image` from database
- Falls back to default image if no R2 image

### 5. `next.config.ts`
- Added R2 domains to image remotePatterns
- Allows Next.js to optimize R2 images

### 6. `package.json` (via pnpm)
- Added `@aws-sdk/client-s3` dependency

## Environment Variables Needed

Add to `.env.local`:
```env
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=macedonia-images
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

## Next Steps

1. **Get R2 Credentials**: Follow the Cloudflare setup steps to get your credentials
2. **Add Environment Variables**: Copy values to `.env.local`
3. **Push Database Changes**: Run `pnpm db:push` to add the `is_admin` column
4. **Set Admin User**: Update your user in the database to set `is_admin = true`
5. **Test Upload**: Try uploading an image on a region page
6. **Bulk Upload**: Use one of the methods in the setup guide to upload all images

## How It Works

### Image Upload Flow
1. Admin clicks "Edit Region" on a region page
2. Selects a new image file
3. Submits the form
4. Frontend sends file to `/api/upload`
5. API uploads to R2 with unique key
6. API returns public URL
7. Frontend sends update request to `/api/regions/[code]/update`
8. Database is updated with new image URL
9. Page reloads showing new image

### Admin Access Control
- Database has `is_admin` boolean field on users
- NextAuth session includes `isAdmin` property
- API routes check `session.user.isAdmin` before allowing operations
- UI components check `session.user.isAdmin` to show/hide admin features

## API Endpoints

### POST `/api/upload`
- **Auth**: Admin only
- **Body**: FormData with `file` and `regionCode`
- **Returns**: `{ imageUrl, key }`

### PATCH `/api/regions/[code]/update`
- **Auth**: Admin only
- **Body**: JSON with optional fields:
  - `name: string`
  - `population: number`
  - `shortDescription: string`
  - `description: string`
  - `image: string`
  - `placesToVisit: string`
- **Returns**: Updated region object

## Security Features

✅ Admin-only routes check session
✅ File validation on upload
✅ Unique keys prevent overwrites
✅ R2 credentials stored in environment variables
✅ Public URLs use R2's CDN (fast, secure)
