import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { router } from '../trpc';
import { StoreKeyProcedure } from './zod_types';


const prisma = new PrismaClient()

export const storeKeyBundleRouter = router({
    procedure: StoreKeyProcedure.mutation(async ({ input }) => {
        console.log(input);
        console.log("SOEUEHRREWBUEWUK");
        const oneTimePreKeyCreate = {
            data: input.bundle.oneTimePreKeys.map((PreKey) => {
                return {
                    keyId: PreKey.keyId,
                    publicKey: PreKey.publicKey
                }
            })
        };

        const signedPreKeyCreate = {
            keyId: input.bundle.signedPreKey.keyId,
            publicKey: input.bundle.signedPreKey.publicKey,
            signature: input.bundle.signedPreKey.signature,
            directoryName: input.address
        }


        const storeKeyBundle = await prisma.directory.create({
            data: {
                name: input.address,
                identityKey: input.bundle.identityKey,
                registrationId: input.bundle.registrationId,
                oneTimePreKeys: { createMany: oneTimePreKeyCreate },
                signedPreKey: { create: signedPreKeyCreate }
            },
        })
    })
})