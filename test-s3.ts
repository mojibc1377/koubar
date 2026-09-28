import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "us-east-1",
  endpoint: "https://storage.c2.liara.site",
  forcePathStyle: true,

  credentials: {
    accessKeyId: "r2234gbea56rruhg",
    secretAccessKey: "024ed53a-123f-419e-8d88-d3136919246f",
  },
});

async function main() {
  console.log("Starting upload...");

  const response = await client.send(
    new PutObjectCommand({
      Bucket: "koubar",
      Key: `test/${Date.now()}.txt`,
      Body: "Hello from Liara",
      ContentType: "text/plain",
    })
  );

  console.log("SUCCESS");
  console.log(response);
}

main().catch((error) => {
  console.error("FAILED");
  console.error(error);
});