import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

export async function GET() {
  try {
    const key = `test/${Date.now()}.txt`;

    await s3.send(
      new PutObjectCommand({
        Bucket: "koubar",
        Key: key,
        Body: "Hello Liara",
        ContentType: "text/plain",
      })
    );

    return Response.json({
      success: true,
      key,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}