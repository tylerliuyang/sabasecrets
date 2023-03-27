import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { procedure, router } from '../trpc';
import { getMessages, StoreKeyProcedure, storeMessage } from './zod_types';


const prisma = new PrismaClient()

export const getMessagesRouter = router({
    procedure: getMessages.query(async ({ input }) => {
        return await prisma.message.findMany({
            where: {
                receiver: input.reciever,
                sender: input.sender,
            }
        });
    })
})  