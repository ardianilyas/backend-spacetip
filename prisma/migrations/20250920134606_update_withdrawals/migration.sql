/*
  Warnings:

  - Added the required column `amountToBeTransferred` to the `withdrawals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `withdrawals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."withdrawals" ADD COLUMN     "amountToBeTransferred" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
