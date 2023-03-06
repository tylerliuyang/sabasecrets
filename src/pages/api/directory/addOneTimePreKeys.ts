import { deserializePreKeyArray } from '@/utility/serialize'
import type { NextApiRequest, NextApiResponse } from 'next'
import { directory, SignalDirectory } from './definitions/directory'
import { AddPreKeysBody } from './definitions/interfaces'


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
    directory.addOneTimePreKeys(body.address, deserializePreKeyArray(body.keys));
    res.status(200).json({})
}
