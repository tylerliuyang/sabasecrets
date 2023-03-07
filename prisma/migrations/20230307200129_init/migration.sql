-- CreateTable
CREATE TABLE "Directory" (
    "name" TEXT NOT NULL,
    "registrationId" INTEGER NOT NULL,
    "identityKey" TEXT NOT NULL,

    CONSTRAINT "Directory_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "SignedPreKey" (
    "id" SERIAL NOT NULL,
    "keyId" INTEGER NOT NULL,
    "publicKey" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "directoryName" TEXT,

    CONSTRAINT "SignedPreKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicPreKey" (
    "id" SERIAL NOT NULL,
    "keyId" INTEGER NOT NULL,
    "publicKey" TEXT NOT NULL,
    "directoryName" TEXT,

    CONSTRAINT "PublicPreKey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SignedPreKey" ADD CONSTRAINT "SignedPreKey_directoryName_fkey" FOREIGN KEY ("directoryName") REFERENCES "Directory"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicPreKey" ADD CONSTRAINT "PublicPreKey_directoryName_fkey" FOREIGN KEY ("directoryName") REFERENCES "Directory"("name") ON DELETE SET NULL ON UPDATE CASCADE;
