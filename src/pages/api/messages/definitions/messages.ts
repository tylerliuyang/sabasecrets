import { FullDirectoryEntry, SerializedFullDirectoryEntry, serializeKeyRegistrationBundle } from "@/utility/serialize";
import { SignedPublicPreKeyType, DeviceType, PreKeyType } from "@privacyresearch/libsignal-protocol-typescript";
import type { NextApiRequest, NextApiResponse } from 'next'


// make use databases later
export class SignalMessages {
    private _data: { [address: string]: [string] } = {}

    storeMessage(address: string, message: string): void {
        if (this._data[address] !== undefined) {
            this._data[address].push(message);
        } else {
            this._data[address] = [message];
        }
    }

    getMessages(address: string): [string] {
        return this._data[address];
    }


    getData(): { [address: string]: [string] } {
        return this._data;
    }
}

export const messages = new SignalMessages;

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    let data = messages.getData();
    res.status(200).json(JSON.stringify(data));
}
