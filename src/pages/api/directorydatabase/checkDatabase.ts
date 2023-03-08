

import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { StoreKeyBody } from '../directory/definitions/interfaces'


const prisma = new PrismaClient()

async function main() {
    const directory = await prisma.directory.findMany({
        include: {
            oneTimePreKeys: true,
            signedPreKey: true
        }
    });

    return directory;
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    // use serializeKeyRegistrationBundle on bundle before calling
    const value = main();
    value.then((e) => {
        res.status(200).json(JSON.stringify(e));
    })
}
