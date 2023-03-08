import { deserializePreKeyArray } from '@/utility/serialize/serialize'
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { AddPreKeysBody } from '../directory/definitions/interfaces';

const prisma = new PrismaClient()

async function main(obj: AddPreKeysBody) {
    const oneTimePreKeyCreate = {
        data: obj.keys.map((PreKey) => {
            return {
                keyId: PreKey.keyId,
                publicKey: PreKey.publicKey,
                directoryName: obj.address
            }
        })
    };


    const storeKeyBundle = await prisma.publicPreKey.createMany(
        oneTimePreKeyCreate
    )
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    // USE SerializePreKeyArray to serialize the PreKeys before calling
    if (req.method !== "POST") {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }
    const body: AddPreKeysBody = JSON.parse(req.body);
    main(body);
    res.status(200).json({})
}
