/*
  Warnings:

  - The `gender` column on the `participants` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ParticipantGender" AS ENUM ('MALE', 'FEMALE', 'TRANSGENDER', 'OTHER');

-- AlterTable
ALTER TABLE "participants" DROP COLUMN "gender",
ADD COLUMN     "gender" "ParticipantGender";
