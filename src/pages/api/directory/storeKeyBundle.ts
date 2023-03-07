import { deserializeKeyBundle, deserializeKeyRegistrationBundle } from '@/utility/serialize/serialize'
import { DeviceType } from '@privacyresearch/libsignal-protocol-typescript'
import type { NextApiRequest, NextApiResponse } from 'next'
import { directory, SignalDirectory } from './definitions/directory'
import { StoreKeyBody } from './definitions/interfaces'




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
    directory.storeKeyBundle(body.address, deserializeKeyRegistrationBundle(body.bundle))
    res.status(200).json({})
}
