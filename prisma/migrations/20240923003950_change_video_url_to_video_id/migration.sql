/*
  Warnings:

  - You are about to drop the column `url` on the `videos` table. All the data in the column will be lost.
  - Added the required column `videoId` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "videos" DROP COLUMN "url",
ADD COLUMN     "videoId" TEXT NOT NULL;
