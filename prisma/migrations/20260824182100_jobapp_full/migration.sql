-- CreateEnum
CREATE TYPE "MarriageStatus" AS ENUM ('SINGLE', 'MARRIED');

-- CreateEnum
CREATE TYPE "MilitaryStatus" AS ENUM ('NOT_APPLICABLE', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "address" TEXT,
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "marriageStatus" "MarriageStatus",
ADD COLUMN     "militaryStatus" "MilitaryStatus";
