import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Initialize R2 client
export const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

/**
 * Upload an image to R2
 * @param file - The file to upload
 * @param key - The key (path) for the file in R2
 * @returns The public URL of the uploaded file
 */
export async function uploadImageToR2(
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await r2Client.send(command);
  
  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Delete an image from R2
 * @param key - The key (path) of the file to delete
 */
export async function deleteImageFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
}

/**
 * Generate a unique key for region images
 */
export function generateRegionImageKey(regionCode: string, fileName: string): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `regions/${regionCode}/${timestamp}-${sanitizedFileName}`;
}
