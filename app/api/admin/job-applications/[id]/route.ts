import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { deleteFileFromStorage } from "@/lib/s3";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  req: Request,
  { params }: Params,
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const allowedStatuses = [
      "SUBMITTED",
      "IN_REVIEW",
      "INTERVIEW",
      "OFFER",
      "HIRED",
      "REJECTED",
    ] as const;

    if (
      body.status &&
      !allowedStatuses.includes(body.status)
    ) {
      return NextResponse.json(
        {
          error: "Invalid application status.",
        },
        {
          status: 400,
        },
      );
    }

    const application =
      await prisma.jobApplication.update({
        where: {
          id,
        },

        data: {
          ...(body.status
            ? {
                status: body.status,
              }
            : {}),
        },
      });

    return NextResponse.json(application);
  } catch (error) {
    console.error(
      "Failed to update job application:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to update application.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: Params,
) {
  try {
    const { id } = await params;

    const application =
      await prisma.jobApplication.findUnique({
        where: {
          id,
        },
      });

    if (!application) {
      return NextResponse.json(
        {
          error: "Application not found.",
        },
        {
          status: 404,
        },
      );
    }

    // Delete resume from Liara first
    if (application.resumeUrl) {
      await deleteFileFromStorage(
        application.resumeUrl,
      );
    }

    // Then delete database record
    await prisma.jobApplication.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Failed to delete job application:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to delete application.",
      },
      {
        status: 500,
      },
    );
  }
}