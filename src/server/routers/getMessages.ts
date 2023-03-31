import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { procedure, router } from '../trpc';
import { getMessages, StoreKeyProcedure, storeMessage } from './zod_types';

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

const prisma = new PrismaClient()

export const getMessagesRouter = router({
    procedure: getMessages.query(async ({ input }) => {
        return await prisma.message.findMany({
            where: {
                receiver: input.reciever,
                sender: input.sender,
                timestamp: { gt: input.after ? input.after : 0 }
            },
        });
    })
})  