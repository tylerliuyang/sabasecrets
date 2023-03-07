import { deserializePreKeyArray } from '@/utility/serialize/serialize'
import type { NextApiRequest, NextApiResponse } from 'next'
import { messages } from './definitions/messages'
import { AddMessage } from './definitions/interfaces'


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    // USE SerializePreKeyArray to serialize the PreKeys before calling
    if (req.method !== "POST") {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }
    console.log(req.body);
    const body: AddMessage = JSON.parse(req.body);
    messages.storeMessage(body.address, body.message);
    res.status(200).json({})
}
