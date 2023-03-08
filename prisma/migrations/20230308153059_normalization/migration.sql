/*
  Warnings:

  - The primary key for the `SignedPreKey` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SignedPreKey` table. All the data in the column will be lost.
  - Made the column `directoryName` on table `PublicPreKey` required. This step will fail if there are existing NULL values in that column.
  - Made the column `directoryName` on table `SignedPreKey` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PublicPreKey" DROP CONSTRAINT "PublicPreKey_directoryName_fkey";

-- DropForeignKey
ALTER TABLE "SignedPreKey" DROP CONSTRAINT "SignedPreKey_directoryName_fkey";

-- AlterTable
ALTER TABLE "PublicPreKey" ALTER COLUMN "directoryName" SET NOT NULL;

-- AlterTable
ALTER TABLE "SignedPreKey" DROP CONSTRAINT "SignedPreKey_pkey",
DROP COLUMN "id",
ALTER COLUMN "directoryName" SET NOT NULL,
ADD CONSTRAINT "SignedPreKey_pkey" PRIMARY KEY ("directoryName");

-- AddForeignKey
ALTER TABLE "SignedPreKey" ADD CONSTRAINT "SignedPreKey_directoryName_fkey" FOREIGN KEY ("directoryName") REFERENCES "Directory"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicPreKey" ADD CONSTRAINT "PublicPreKey_directoryName_fkey" FOREIGN KEY ("directoryName") REFERENCES "Directory"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
