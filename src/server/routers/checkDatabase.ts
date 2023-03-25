

import { PrismaClient } from '@prisma/client'

import { procedure, router } from '../trpc'


const prisma = new PrismaClient()

export const checkDatabaseRouter = router({
    procedure: procedure.query(async () => {
        const directory = await prisma.directory.findMany({
            include: {
                oneTimePreKeys: true,
                signedPreKey: true
            }
        });
        return directory;
    })
})