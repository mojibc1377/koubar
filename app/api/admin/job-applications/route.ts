import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const applications =
      await prisma.jobApplication.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(applications);
  } catch (error) {
    console.error(
      "Failed to fetch job applications:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to fetch applications.",
      },
      {
        status: 500,
      },
    );
  }
}