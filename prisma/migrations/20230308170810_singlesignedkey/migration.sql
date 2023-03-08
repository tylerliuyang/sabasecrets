/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Directory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[signedPreKeyDirectoryName]` on the table `Directory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `signedPreKeyDirectoryName` to the `Directory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Directory" DROP CONSTRAINT "Directory_name_fkey";

-- AlterTable
ALTER TABLE "Directory" ADD COLUMN     "signedPreKeyDirectoryName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Directory_name_key" ON "Directory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Directory_signedPreKeyDirectoryName_key" ON "Directory"("signedPreKeyDirectoryName");

-- AddForeignKey
ALTER TABLE "Directory" ADD CONSTRAINT "Directory_signedPreKeyDirectoryName_fkey" FOREIGN KEY ("signedPreKeyDirectoryName") REFERENCES "SignedPreKey"("directoryName") ON DELETE RESTRICT ON UPDATE CASCADE;
