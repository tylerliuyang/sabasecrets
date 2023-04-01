import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { router } from '../trpc';
import { StoreKeyProcedure, storeMessage } from './zod_types';


const prisma = new PrismaClient()

export const storeMessageRouter = router({
    procedure: storeMessage.mutation(async ({ input }) => {

        await prisma.message.create({
            data: {
                message: input.message,
                receiver: input.reciever,
                sender: input.sender,
                type: input.type,
                timestamp: input.timestamp
            }
        });
    })
})  