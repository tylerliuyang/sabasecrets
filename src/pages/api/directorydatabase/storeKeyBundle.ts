import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { StoreKeyBody } from '../directory/definitions/interfaces'


const prisma = new PrismaClient()

async function main(obj: StoreKeyBody) {
    const oneTimePreKeyCreate = {
        data: obj.bundle.oneTimePreKeys.map((PreKey) => {
            return {
                keyId: PreKey.keyId,
                publicKey: PreKey.publicKey
            }
        })
    };

    const signedPreKeyCreate = {
        keyId: obj.bundle.signedPreKey.keyId,
        publicKey: obj.bundle.signedPreKey.publicKey,
        signature: obj.bundle.signedPreKey.signature,
        directoryName: obj.address
    }


    const storeKeyBundle = await prisma.directory.create({
        data: {
            name: obj.address,
            identityKey: obj.bundle.identityKey,
            registrationId: obj.bundle.registrationId,
            oneTimePreKeys: { createMany: oneTimePreKeyCreate },
            signedPreKey: { create: signedPreKeyCreate }
        },
    })
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    // use serializeKeyRegistrationBundle on bundle before calling
    if (req.method !== "POST") {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }
    const body: StoreKeyBody = JSON.parse(req.body)
    main(body);
    res.status(200).json({})
}