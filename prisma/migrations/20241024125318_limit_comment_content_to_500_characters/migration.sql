/*
  Warnings:

  - You are about to alter the column `content` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.

*/
-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "content" SET DATA TYPE VARCHAR(500);
