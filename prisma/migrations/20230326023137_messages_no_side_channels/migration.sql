/*
  Warnings:

  - You are about to drop the column `directoryName` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `senderName` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `sideChannelId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `SideChannel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `receiver` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sideChannelId_fkey";

-- DropForeignKey
ALTER TABLE "SideChannel" DROP CONSTRAINT "SideChannel_reciever_fkey";

-- DropForeignKey
ALTER TABLE "SideChannel" DROP CONSTRAINT "SideChannel_sender_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "directoryName",
DROP COLUMN "senderName",
DROP COLUMN "sideChannelId",
ADD COLUMN     "receiver" TEXT NOT NULL,
ADD COLUMN     "sender" TEXT NOT NULL;

-- DropTable
DROP TABLE "SideChannel";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_fkey" FOREIGN KEY ("sender") REFERENCES "Directory"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "Directory"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
