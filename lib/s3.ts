import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const BUCKET_NAME = process.env.LIARA_BUCKET_NAME!;

export const s3 = new S3Client({
  region: "us-east-1",
  endpoint: process.env.LIARA_ENDPOINT!,
  forcePathStyle: true,

  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY!,
    secretAccessKey: process.env.LIARA_SECRET_KEY!,
  },
});

export async function uploadFileToStorage(
  key: string,
  buffer: Buffer,
  contentType: string
) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return key;
}

export function getImageUrl(key: string) {
  if (!key) return "";

  const base = "https://koubarroastery.com";

  const cleanKey = key.startsWith("/")
    ? key.slice(1)
    : key;

  return encodeURI(`${base}/${cleanKey}`);
}

export async function deleteFileFromStorage(key: string) {
  if (!key) return;

  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );
}

export async function generateSignedUrl(key: string) {
  if (!key) return "";

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const rawUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600,
    });

    return encodeURI(
      rawUrl.replace(
        "koubar.storage.c2.liara.site",
        "koubarroastery.com"
      )
    );
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return "";
  }
}

