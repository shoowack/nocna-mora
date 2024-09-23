/*
  Warnings:

  - The primary key for the `actors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `memes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `videos` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_ActorImages" DROP CONSTRAINT "_ActorImages_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActorImages" DROP CONSTRAINT "_ActorImages_B_fkey";

-- DropForeignKey
ALTER TABLE "_ActorVideos" DROP CONSTRAINT "_ActorVideos_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActorVideos" DROP CONSTRAINT "_ActorVideos_B_fkey";

-- DropForeignKey
ALTER TABLE "memes" DROP CONSTRAINT "memes_imageId_fkey";

-- AlterTable
ALTER TABLE "_ActorImages" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_ActorVideos" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "actors" DROP CONSTRAINT "actors_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "actors_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "actors_id_seq";

-- AlterTable
ALTER TABLE "images" DROP CONSTRAINT "images_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "images_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "images_id_seq";

-- AlterTable
ALTER TABLE "memes" DROP CONSTRAINT "memes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "imageId" SET DATA TYPE TEXT,
ADD CONSTRAINT "memes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "memes_id_seq";

-- AlterTable
ALTER TABLE "videos" DROP CONSTRAINT "videos_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "videos_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "videos_id_seq";

-- AddForeignKey
ALTER TABLE "memes" ADD CONSTRAINT "memes_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActorVideos" ADD CONSTRAINT "_ActorVideos_A_fkey" FOREIGN KEY ("A") REFERENCES "actors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActorVideos" ADD CONSTRAINT "_ActorVideos_B_fkey" FOREIGN KEY ("B") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActorImages" ADD CONSTRAINT "_ActorImages_A_fkey" FOREIGN KEY ("A") REFERENCES "actors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActorImages" ADD CONSTRAINT "_ActorImages_B_fkey" FOREIGN KEY ("B") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
