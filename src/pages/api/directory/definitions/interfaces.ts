import { PublicPreKey, SerializedFullDirectoryEntry } from "@/utility/serialize/types";
import { PreKeyType } from '@privacyresearch/libsignal-protocol-typescript';
import type { NextApiRequest } from 'next'

export interface StoreKeyBody {
    address: string;
    bundle: SerializedFullDirectoryEntry;
}

export interface GetPreKeyBody {
    address: string;
}

export interface AddPreKeysBody {
    address: string;
    keys: PublicPreKey[];
}
