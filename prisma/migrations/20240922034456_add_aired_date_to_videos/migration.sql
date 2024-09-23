/*
  Warnings:

  - Added the required column `airedDate` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "airedDate" TIMESTAMP(3) NOT NULL;
