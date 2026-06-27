import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { jsonError } from "./errors";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: jsonError("Unauthorized", 401) } as const;
  }
  return { session } as const;
}

export async function requireAdmin() {
  const result = await requireUser();
  if ("error" in result) return result;

  const user = await prisma.user.findUnique({
    where: { id: result.session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    return { error: jsonError("Forbidden", 403) } as const;
  }

  return result;
}
