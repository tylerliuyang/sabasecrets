import { deserializePreKeyArray } from '@/utility/serialize/serialize'
import type { NextApiRequest, NextApiResponse } from 'next'
import { messages } from './definitions/messages'
import { AddMessage, GetMessages } from './definitions/interfaces'


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    // USE SerializePreKeyArray to serialize the PreKeys before calling
    if (req.method !== "POST") {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }
    const body: GetMessages = JSON.parse(req.body);

    res.status(200).json({ message: messages.getMessages(body.address) })
};
