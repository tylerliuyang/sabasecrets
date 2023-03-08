/*
  Warnings:

  - A unique constraint covering the columns `[directoryName]` on the table `SignedPreKey` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "SignedPreKey" DROP CONSTRAINT "SignedPreKey_directoryName_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "SignedPreKey_directoryName_key" ON "SignedPreKey"("directoryName");

-- AddForeignKey
ALTER TABLE "Directory" ADD CONSTRAINT "Directory_name_fkey" FOREIGN KEY ("name") REFERENCES "SignedPreKey"("directoryName") ON DELETE RESTRICT ON UPDATE CASCADE;
