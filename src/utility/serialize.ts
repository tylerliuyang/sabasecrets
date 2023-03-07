
import { SignedPublicPreKeyType, DeviceType, PreKeyType, KeyPairType } from '@privacyresearch/libsignal-protocol-typescript'
import * as base64 from 'base64-js'
import { FullDirectoryEntry, SerializedFullDirectoryEntry, SignedPublicKey, PublicPreKey, PublicPreKeyBundle, SerializedKeyPair } from './serialize/types'


export function serializeKeyRegistrationBundle(dv: FullDirectoryEntry): SerializedFullDirectoryEntry {
    const identityKey = base64.fromByteArray(new Uint8Array(dv.identityKey))
    const signedPreKey: SignedPublicKey = {
        keyId: dv.signedPreKey.keyId,
        publicKey: base64.fromByteArray(new Uint8Array(dv.signedPreKey.publicKey)),
        signature: base64.fromByteArray(new Uint8Array(dv.signedPreKey.signature)),
    }

    const oneTimePreKeys = serializePreKeyArray(dv.oneTimePreKeys)

    return {
        identityKey,
        signedPreKey,
        oneTimePreKeys,
        registrationId: dv.registrationId!,
    }
}

export function deserializeKeyRegistrationBundle(dv: SerializedFullDirectoryEntry): FullDirectoryEntry {
    const identityKey = base64.toByteArray(dv.identityKey).buffer;
    const signedPreKey: SignedPublicPreKeyType = {
        keyId: dv.signedPreKey.keyId,
        publicKey: base64.toByteArray(dv.signedPreKey.publicKey).buffer,
        signature: base64.toByteArray(dv.signedPreKey.signature).buffer,
    }

    const oneTimePreKeys = deserializePreKeyArray(dv.oneTimePreKeys)

    return {
        identityKey,
        signedPreKey,
        oneTimePreKeys,
        registrationId: dv.registrationId!,
    }
}

export function serializeKeyBundle(dv: DeviceType): PublicPreKeyBundle {
    const identityKey = base64.fromByteArray(new Uint8Array(dv.identityKey))
    const signedPreKey: SignedPublicKey = {
        keyId: dv.signedPreKey.keyId,
        publicKey: base64.fromByteArray(new Uint8Array(dv.signedPreKey.publicKey)),
        signature: base64.fromByteArray(new Uint8Array(dv.signedPreKey.signature)),
    }

    const preKey: PublicPreKey = {
        keyId: dv.preKey!.keyId,
        publicKey: base64.fromByteArray(new Uint8Array(dv.preKey!.publicKey)),
    }

    return {
        identityKey,
        signedPreKey,
        preKey,
        registrationId: dv.registrationId!,
    }
}

export function deserializeKeyBundle(kb: PublicPreKeyBundle): DeviceType {
    const identityKey = base64.toByteArray(kb.identityKey).buffer
    const signedPreKey: SignedPublicPreKeyType = {
        keyId: kb.signedPreKey.keyId,
        publicKey: base64.toByteArray(kb.signedPreKey.publicKey).buffer,
        signature: base64.toByteArray(kb.signedPreKey.signature).buffer,
    }
    const preKey: PreKeyType | undefined = kb.preKey && {
        keyId: kb.preKey.keyId,
        publicKey: base64.toByteArray(kb.preKey.publicKey).buffer,
    }

    return {
        identityKey,
        signedPreKey,
        preKey,
        registrationId: kb.registrationId,
    }
}

export function serializePreKeyArray(keys: PreKeyType[]): PublicPreKey[] {
    const serialized: PublicPreKey[] = [];
    for (let key in keys) {
        const preKey: PublicPreKey = {
            keyId: keys[key].keyId,
            publicKey: base64.fromByteArray(new Uint8Array(keys[key].publicKey)),
        }
        serialized.push(preKey);
    }
    return serialized;
}

export function deserializePreKeyArray(keys: PublicPreKey[]): PreKeyType[] {
    const deserialized: PreKeyType[] = [];
    for (let key in keys) {
        const preKey: PreKeyType = {
            keyId: keys[key].keyId,
            publicKey: base64.toByteArray(keys[key].publicKey).buffer,
        }
        deserialized.push(preKey);
    }
    return deserialized;
}

export function serializeKeyPairType(key: KeyPairType): SerializedKeyPair {
    return {
        pubKey: base64.fromByteArray(new Uint8Array(key.pubKey)),
        privKey: base64.fromByteArray(new Uint8Array(key.privKey)),
    }
}

export function deserializeKeyPairType(key: SerializedKeyPair): KeyPairType {
    return {
        pubKey: base64.toByteArray(key.pubKey).buffer,
        privKey: base64.toByteArray(key.privKey).buffer,
    }
}