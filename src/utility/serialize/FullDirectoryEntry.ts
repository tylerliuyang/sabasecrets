import { SignedPublicPreKeyType, PreKeyType } from '@privacyresearch/libsignal-protocol-typescript';


export interface PublicDirectoryEntry {
    identityKey: ArrayBuffer;
    signedPreKey: SignedPublicPreKeyType;
    oneTimePreKey?: ArrayBuffer;
}

export interface FullDirectoryEntry {
    registrationId: number;
    identityKey: ArrayBuffer;
    signedPreKey: SignedPublicPreKeyType;
    oneTimePreKeys: PreKeyType[];
}

export interface PublicPreKey {
    keyId: number;
    publicKey: string;
}

export interface SignedPublicKey {
    keyId: number;
    publicKey: string;
    signature: string;
}

export interface PublicPreKeyBundle {
    identityKey: string;
    signedPreKey: SignedPublicKey;
    preKey?: PublicPreKey;
    registrationId: number;
}

export interface SerializedFullDirectoryEntry {
    registrationId: number;
    identityKey: string;
    signedPreKey: SignedPublicKey;
    oneTimePreKeys: PublicPreKey[];
}

export interface SerializedKeyPair {
    pubKey: string;
    privKey: string;
}
