import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/phone";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    name?: string;
    phone?: string;
    address?: string;
  };

  const data: { name?: string; phone?: string; address?: string } = {};

  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.address === "string") data.address = body.address.trim();

  if (typeof body.phone === "string") {
    const phone = normalizePhone(body.phone);
    if (!phone) {
      return NextResponse.json({ error: "شماره موبایل معتبر نیست." }, { status: 400 });
    }
    const taken = await prisma.user.findFirst({
      where: { phone, NOT: { id: session.user.id } },
    });
    if (taken) {
      return NextResponse.json({ error: "این شماره قبلاً استفاده شده است." }, { status: 409 });
    }
    data.phone = phone;
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
  });

  return NextResponse.json({
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name ?? "",
      address: user.address ?? "",
    },
  });
}
