/*
  Warnings:

  - A unique constraint covering the columns `[storageKey]` on the table `ReferenceImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mimeType` to the `ReferenceImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ReferenceImage" ADD COLUMN     "mimeType" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ReferenceImage_storageKey_key" ON "public"."ReferenceImage"("storageKey");
