import { serializeKeyRegistrationBundle } from "@/utility/serialize/serialize";
import { FullDirectoryEntry, SerializedFullDirectoryEntry } from "@/utility/serialize/FullDirectoryEntry";
import { SignedPublicPreKeyType, DeviceType, PreKeyType } from "@privacyresearch/libsignal-protocol-typescript";
import type { NextApiRequest, NextApiResponse } from 'next'


// make use databases later
export class SignalDirectory {
    private _data: { [address: string]: FullDirectoryEntry } = {}

    storeKeyBundle(address: string, bundle: FullDirectoryEntry): void {
        this._data[address] = bundle
    }

    addOneTimePreKeys(address: string, keys: PreKeyType[]): void {
        if (this._data[address] === undefined) {
            console.log("Failed to add PreKeys to ", address);
            return;
        }
        this._data[address].oneTimePreKeys.unshift(...keys)
    }

    getPreKeyBundle(address: string): DeviceType | undefined {
        const bundle = this._data[address]
        if (!bundle) {
            return undefined
        }
        const oneTimePreKey = bundle.oneTimePreKeys.pop()
        const { identityKey, signedPreKey, registrationId } = bundle
        return { identityKey: identityKey, signedPreKey, preKey: oneTimePreKey, registrationId }
    }

    getData(): { [address: string]: FullDirectoryEntry } {
        return this._data;
    }

}

export const directory = new SignalDirectory;

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    const response: { [address: string]: SerializedFullDirectoryEntry } = {};
    let data = directory.getData();
    for (let key in data) {
        const value = data[key];
        response[key] = serializeKeyRegistrationBundle(value);
    }
    res.status(200).json(JSON.stringify(response));
}
