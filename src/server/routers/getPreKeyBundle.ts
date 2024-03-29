import { PublicPreKeyBundle } from '@/utility/serialize/FullDirectoryEntry'
import * as trpc from '@trpc/server';
import { PrismaClient } from '@prisma/client'
import { procedure, router } from '../trpc'
import { GetPreKeyProcedure } from './zod_types'


const prisma = new PrismaClient()

export const getPreKeyBundleRouter = router({
    procedure: GetPreKeyProcedure.query(async ({ input }) => {
        const PreKeyBundle = await prisma.publicPreKey.findFirst({ where: { directoryName: input.address } })
        if (PreKeyBundle === null) {
            throw new trpc.TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No more keys!" });
        }

        await prisma.publicPreKey.delete({
            where: { id: PreKeyBundle?.id }
        })
        const user = await prisma.directory.findFirst({ where: { name: PreKeyBundle?.directoryName! }, select: { identityKey: true, registrationId: true } })
        const signedPreKey = await prisma.signedPreKey.findFirst({ where: { directoryName: PreKeyBundle?.directoryName! } })

        const bundle: PublicPreKeyBundle = {
            identityKey: user?.identityKey!,
            registrationId: user?.registrationId!,
            signedPreKey: signedPreKey!,
            preKey: PreKeyBundle!
        }
        return bundle;
    })
})