import { PublicPreKey, SerializedFullDirectoryEntry } from '@/utility/serialize';
import { PreKeyType } from '@privacyresearch/libsignal-protocol-typescript';
import type { NextApiRequest } from 'next'


export interface AddMessage {
    address: string;
    message: string;
}

export interface GetMessages {
    address: string;
}

export interface RemoveMessage {
    address: string;
}


// export interface AddPreKeysBody {
//     address: string;
//     keys: PublicPreKey[];
// }
