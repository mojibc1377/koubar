import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api/auth";
import { jsonOk } from "@/lib/api/errors";
import { formatDisplayDate } from "@/lib/dates";

export async function GET() {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const staffMembers = await prisma.staff.findMany({
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true } },
        },
      },
    },
  });

  const leaderboard = staffMembers
    .map((staff) => {
      const totalReviews = staff.reviews.length;
      const avgStaffStars =
        totalReviews > 0
          ? staff.reviews.reduce((sum, r) => sum + r.staffStars, 0) / totalReviews
          : 0;
      const avgFoodStars =
        totalReviews > 0
          ? staff.reviews.reduce((sum, r) => sum + r.foodStars, 0) / totalReviews
          : 0;

      return {
        id: staff.id,
        name: staff.name,
        role: staff.role,
        avatar: staff.avatar,
        active: staff.active,
        avgStaffStars: Math.round(avgStaffStars * 10) / 10,
        avgFoodStars: Math.round(avgFoodStars * 10) / 10,
        totalReviews,
        recentComments: staff.reviews.slice(0, 10).map((r) => ({
          userName: r.user.name ?? "کاربر",
          comment: r.comment ?? "",
          date: formatDisplayDate(r.createdAt),
          staffStars: r.staffStars,
          foodStars: r.foodStars,
        })),
      };
    })
    .sort((a, b) => b.avgStaffStars - a.avgStaffStars);

  return jsonOk(leaderboard);
}
