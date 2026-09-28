-- AlterTable
ALTER TABLE "CafeMenuItem" ADD COLUMN     "priceSecondary" INTEGER,
ADD COLUMN     "dualCoffeePricing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "linePrimaryLabel" TEXT,
ADD COLUMN     "lineSecondaryLabel" TEXT;
