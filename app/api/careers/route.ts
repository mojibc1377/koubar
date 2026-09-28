import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust to your prisma client singleton path
import { uploadFileToStorage } from "@/lib/s3";

export const runtime = "nodejs";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function generateApplicationNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `APP-${year}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const fullName = String(formData.get("fullName") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const department = String(formData.get("department") || "").trim();
    const positionTitle = String(formData.get("positionTitle") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const resume = formData.get("resume") as File | null;
    const ageValue = String(formData.get("age") || "").trim();
    const marriageStatus = String(formData.get("marriageStatus") || "").trim();
    const militaryStatus = String(formData.get("militaryStatus") || "").trim();
    const address = String(formData.get("address") || "").trim();

    if (!fullName || !phone || !department || !positionTitle || !resume) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    if (!["CAFE", "ROASTERY", "GENERAL"].includes(department)) {
      return NextResponse.json(
        { error: "Invalid department." },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(resume.type)) {
      return NextResponse.json(
        { error: "Resume must be a PDF or Word document." },
        { status: 400 },
      );
    }

    if (resume.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Resume must be smaller than 5MB." },
        { status: 400 },
      );
    }
    const age = ageValue ? Number(ageValue) : null;

if (ageValue && age && (!Number.isInteger(age) || age < 15 || age > 100)) {
  return NextResponse.json(
    { error: "Invalid age." },
    { status: 400 },
  );
}

if (
  marriageStatus &&
  !["SINGLE", "MARRIED"].includes(marriageStatus)
) {
  return NextResponse.json(
    { error: "Invalid marriage status." },
    { status: 400 },
  );
}

if (
  militaryStatus &&
  !["NOT_APPLICABLE", "IN_PROGRESS", "COMPLETED"].includes(
    militaryStatus,
  )
) {
  return NextResponse.json(
    { error: "Invalid military status." },
    { status: 400 },
  );
}

    // ── Store the file ──────────────────────────────────────────
    // NOTE: writing to the local filesystem only works reliably in
    // a traditional Node server or local dev. On Vercel/serverless,
    // the filesystem is read-only except /tmp and is NOT persistent
    // between deploys. Swap this block for Vercel Blob, S3, or
    // UploadThing before going to production. Example with Vercel Blob:
    //
    //   import { put } from "@vercel/blob";
    //   const blob = await put(`resumes/${filename}`, resume, { access: "public" });
    //   const resumeUrl = blob.url;
    const bytes = await resume.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = resume.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");

    const key = `resumes/${Date.now()}-${safeName}`;

    await uploadFileToStorage(key, buffer, resume.type);
    const application = await prisma.jobApplication.create({
  data: {
    applicationNumber: generateApplicationNumber(),

    fullName,
    phone,
    email: email || null,

    age,
    marriageStatus: marriageStatus
      ? (marriageStatus as "SINGLE" | "MARRIED")
      : null,

    militaryStatus: militaryStatus
      ? (militaryStatus as
          | "NOT_APPLICABLE"
          | "IN_PROGRESS"
          | "COMPLETED")
      : null,

    address: address || null,

    department: department as "CAFE" | "ROASTERY" | "GENERAL",
    positionTitle,
    message: message || null,
    resumeUrl: key,
    resumeFileName: resume.name,
  },
});

    return NextResponse.json(
      {
        applicationNumber: application.applicationNumber,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Career application submit failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
