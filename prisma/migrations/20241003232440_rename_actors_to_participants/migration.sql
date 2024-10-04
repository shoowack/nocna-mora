/*
  Warnings:

  - You are about to drop the `_ActorImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ActorVideos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `actors` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ParticipantType" AS ENUM ('MAIN', 'GUEST');

-- DropForeignKey
ALTER TABLE "_ActorImages" DROP CONSTRAINT "_ActorImages_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActorImages" DROP CONSTRAINT "_ActorImages_B_fkey";

-- DropForeignKey
ALTER TABLE "_ActorVideos" DROP CONSTRAINT "_ActorVideos_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActorVideos" DROP CONSTRAINT "_ActorVideos_B_fkey";

-- DropForeignKey
ALTER TABLE "actors" DROP CONSTRAINT "actors_userId_fkey";

-- DropTable
DROP TABLE "_ActorImages";

-- DropTable
DROP TABLE "_ActorVideos";

-- DropTable
DROP TABLE "actors";

-- DropEnum
DROP TYPE "ActorType";

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "nickname" TEXT,
    "bio" TEXT,
    "gender" TEXT,
    "birthDate" TIMESTAMP(3),
    "deathDate" TIMESTAMP(3),
    "slug" TEXT NOT NULL,
    "type" "ParticipantType" NOT NULL DEFAULT 'GUEST',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ParticipantImages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ParticipantVideos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "participants_slug_key" ON "participants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantImages_AB_unique" ON "_ParticipantImages"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantImages_B_index" ON "_ParticipantImages"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantVideos_AB_unique" ON "_ParticipantVideos"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantVideos_B_index" ON "_ParticipantVideos"("B");

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantImages" ADD CONSTRAINT "_ParticipantImages_A_fkey" FOREIGN KEY ("A") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantImages" ADD CONSTRAINT "_ParticipantImages_B_fkey" FOREIGN KEY ("B") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantVideos" ADD CONSTRAINT "_ParticipantVideos_A_fkey" FOREIGN KEY ("A") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantVideos" ADD CONSTRAINT "_ParticipantVideos_B_fkey" FOREIGN KEY ("B") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
