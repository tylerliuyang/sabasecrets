-- CreateTable
CREATE TABLE "SideChannel" (
    "id" SERIAL NOT NULL,
    "sender" TEXT NOT NULL,
    "reciever" TEXT NOT NULL,

    CONSTRAINT "SideChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "senderName" TEXT NOT NULL,
    "directoryName" TEXT NOT NULL,
    "sideChannelId" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SideChannel" ADD CONSTRAINT "SideChannel_reciever_fkey" FOREIGN KEY ("reciever") REFERENCES "Directory"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SideChannel" ADD CONSTRAINT "SideChannel_sender_fkey" FOREIGN KEY ("sender") REFERENCES "Directory"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sideChannelId_fkey" FOREIGN KEY ("sideChannelId") REFERENCES "SideChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
