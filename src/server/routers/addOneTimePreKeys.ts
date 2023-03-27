import { PublicPreKey } from '@/utility/serialize/FullDirectoryEntry';
import { deserializePreKeyArray } from '@/utility/serialize/serialize'
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'


import { z } from 'zod';
import { procedure, router } from '../trpc';
import { PublicPreKeyProcedure } from './zod_types';

const prisma = new PrismaClient()

export const addOneTimePreKeysRouter = router({
    procedure: PublicPreKeyProcedure
        .mutation(async ({ input }) => {
            const oneTimePreKeyCreate = {
                data: input.keys.map((PreKey) => {
                    return {
                        keyId: PreKey.keyId,
                        publicKey: PreKey.publicKey,
                        directoryName: input.address
                    }
                })
            };

            const value = await prisma.publicPreKey.createMany(
                oneTimePreKeyCreate
            )
            return value.count;
        })
})