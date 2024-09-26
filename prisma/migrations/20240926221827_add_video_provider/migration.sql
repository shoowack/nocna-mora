/*
  Warnings:

  - Added the required column `provider` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VideoProvider" AS ENUM ('YOUTUBE', 'VIMEO', 'DAILYMOTION');

-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "provider" "VideoProvider" NOT NULL;
