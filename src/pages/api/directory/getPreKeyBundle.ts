import { serializeKeyBundle } from '@/utility/serialize'
import { DeviceType } from '@privacyresearch/libsignal-protocol-typescript'
import type { NextApiRequest, NextApiResponse } from 'next'
import { directory, SignalDirectory } from './definitions/directory'
import { GetPreKeyBody } from './definitions/interfaces'




export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    // 
    if (req.method !== "POST") {
        res.status(405).send('Only POST requests allowed')
        return
    }
    const body: GetPreKeyBody = JSON.parse(req.body);
    const bundle = directory.getPreKeyBundle(body.address);
    if (bundle === undefined) {
        return;
    }
    let PreKeyBundle = serializeKeyBundle(bundle);
    res.status(200).json(JSON.stringify(PreKeyBundle))
}
