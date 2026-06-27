import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/errors";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const { id } = await params;
  const body = (await request.json()) as {
    name?: string;
    address?: string;
    role?: "USER" | "ADMIN";
  };

  const data: { name?: string; address?: string; role?: UserRole } = {};
  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.address === "string") data.address = body.address.trim();
  if (body.role === "USER" || body.role === "ADMIN") data.role = body.role;

  const user = await prisma.user.update({ where: { id }, data });
  return jsonOk({ id: user.id, role: user.role });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const { id } = await params;
  if (id === authResult.session.user.id) {
    return jsonError("نمی‌توانید حساب خود را حذف کنید", 400);
  }

  await prisma.user.delete({ where: { id } });
  return jsonOk({ ok: true });
}
