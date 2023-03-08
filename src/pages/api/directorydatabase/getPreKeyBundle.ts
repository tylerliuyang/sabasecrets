import { PublicPreKeyBundle } from '@/utility/serialize/FullDirectoryEntry'
import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { GetPreKeyBody, StoreKeyBody } from '../directory/definitions/interfaces'


const prisma = new PrismaClient()

async function main(address: string) {
    const PreKeyBundle = await prisma.publicPreKey.findFirst({ where: { directoryName: address } })
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
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    // use serializeKeyRegistrationBundle on bundle before calling
    if (req.method !== "POST") {
        res.status(405).send('Only POST requests allowed')
        return
    }
    const body: GetPreKeyBody = JSON.parse(req.body);
    main(body.address).then((bundle) => {
        if (bundle === undefined) {
            res.status(409).json("Failed to get PreKey!");
            return;
        }
        res.status(200).json(JSON.stringify(bundle));

    })
}