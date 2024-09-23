/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `actors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `actors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "actors" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "actors_slug_key" ON "actors"("slug");
