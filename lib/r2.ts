// AWS SDK temporarily removed to reduce package size for Deno Deploy
// To re-enable R2 uploads, run: pnpm add @aws-sdk/client-s3

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

/**
 * Upload an image to R2 (TEMPORARILY DISABLED)
 * @param file - The file to upload
 * @param key - The key (path) for the file in R2
 * @returns The public URL of the uploaded file
 */
export async function uploadImageToR2(
  _file: Buffer,
  _key: string,
  _contentType: string
): Promise<string> {
  throw new Error('R2 uploads temporarily disabled. AWS SDK removed to reduce package size.');
}

/**
 * Delete an image from R2 (TEMPORARILY DISABLED)
 * @param key - The key (path) of the file to delete
 */
export async function deleteImageFromR2(_key: string): Promise<void> {
  throw new Error('R2 deletes temporarily disabled. AWS SDK removed to reduce package size.');
}

/**
 * Generate a unique key for region images
 */
export function generateRegionImageKey(regionCode: string, fileName: string): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `regions/${regionCode}/${timestamp}-${sanitizedFileName}`;
}
