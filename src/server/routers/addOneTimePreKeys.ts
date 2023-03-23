import { PublicPreKey } from '@/utility/serialize/FullDirectoryEntry';
import { deserializePreKeyArray } from '@/utility/serialize/serialize'
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'


import { z } from 'zod';
import { procedure, router } from '../trpc';
import { addAddress, addPreKeyArray, PublicPreKeyProcedure } from './zod_types';


export interface AddPreKeysBody {
    address: string;
    keys: PublicPreKey[];
}

const prisma = new PrismaClient()

export const AppRouter = router({
    addOneTimePreKey: PublicPreKeyProcedure
        .query(({ input }) => {
            const oneTimePreKeyCreate = {
                data: input.keys.map((PreKey) => {
                    return {
                        keyId: PreKey.keyId,
                        publicKey: PreKey.publicKey,
                        directoryName: input.address
                    }
                })
            };

            prisma.publicPreKey.createMany(
                oneTimePreKeyCreate
            )

        })
})