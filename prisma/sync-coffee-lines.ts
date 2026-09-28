import { PrismaClient } from "@prisma/client";
import { cafeMenu } from "../lib/cafe-menu";

const prisma = new PrismaClient();

async function main() {
  for (const category of cafeMenu) {
    for (const item of category.items) {
      if (!("dualCoffeePricing" in item) || !item.dualCoffeePricing) continue;

      await prisma.cafeMenuItem.updateMany({
        where: { slug: item.id },
        data: {
          dualCoffeePricing: true,
          price: item.price,
          priceSecondary: item.priceSecondary ?? null,
          linePrimaryLabel: item.linePrimaryLabel ?? null,
          lineSecondaryLabel: item.lineSecondaryLabel ?? null,
        },
      });
    }
  }

  console.log("✅ Cafe coffee-line pricing synced");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
