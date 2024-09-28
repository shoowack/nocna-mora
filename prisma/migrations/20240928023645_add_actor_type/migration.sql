-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('MAIN', 'GUEST');

-- AlterTable
ALTER TABLE "actors" ADD COLUMN     "type" "ActorType" NOT NULL DEFAULT 'GUEST';
