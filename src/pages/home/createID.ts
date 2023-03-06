import { SignalProtocolStore } from "@/utility/storage-type";
import {
    KeyHelper,
    SignedPublicPreKeyType,
    SignalProtocolAddress,
    SessionBuilder,
    PreKeyType,
    SessionCipher,
    MessageType,
    KeyPairType,
} from "@privacyresearch/libsignal-protocol-typescript";
import { deserializeKeyPairType, deserializeKeyRegistrationBundle, FullDirectoryEntry, SerializedKeyPair, serializeKeyPairType, serializeKeyRegistrationBundle } from "../../utility/serialize";
import * as base64 from 'base64-js'

const storeKeyPair = (name: string, KeyPair: KeyPairType) => {
    const privstr = base64.fromByteArray(new Uint8Array(KeyPair.privKey));
    window.localStorage.setItem(name + 'priv', privstr);
    const pubstr = base64.fromByteArray(new Uint8Array(KeyPair.pubKey));
    window.localStorage.setItem(name + 'pub', pubstr);
}



export const getKeyPair = (name: string): KeyPairType | undefined => {
    const pub = window.localStorage.getItem(name + 'pub');
    const priv = window.localStorage.getItem(name + 'priv');
    if (pub == null || priv == null) {
        return;
    }

    const pubArrayBuffer = base64.toByteArray(pub).buffer;
    const privArrayBuffer = base64.toByteArray(priv).buffer;

    return { privKey: privArrayBuffer, pubKey: pubArrayBuffer }
}

export const storeKeyPairs = (name: string, id: number, KeyPair: KeyPairType) => {
    const localstorage = window.localStorage.getItem(name);
    let values: { [id: number]: SerializedKeyPair } = {};
    if (localstorage !== null) {
        values = JSON.parse(localstorage);
        values[id] = serializeKeyPairType(KeyPair);
    } else {
        values[id] = serializeKeyPairType(KeyPair);
    }
    window.localStorage.setItem(name, JSON.stringify(values));
}

export const getKeyPairs = (name: string) => {
    const localstorage = window.localStorage.getItem(name);
    if (localstorage === null) {
        return
    }
    const keys: { [id: number]: SerializedKeyPair } = JSON.parse(localstorage);
    const keyMap: { [id: number]: KeyPairType } = {};
    for (let key in keys) {
        keyMap[key] = deserializeKeyPairType(keys[key])
    }
    return keyMap;
}

export const createID = async (name: string,
    //  signalStore: SignalProtocolStore
) => {
    window.localStorage.setItem('name', name);
    const registrationId = KeyHelper.generateRegistrationId();
    window.localStorage.setItem(`registrationID`, registrationId.toString());

    const identityKeyPair = await KeyHelper.generateIdentityKeyPair()
    storeKeyPair('identityKey', identityKeyPair);

    const baseKeyId = Math.floor(10000 * Math.random());
    const preKey = await KeyHelper.generatePreKey(baseKeyId)
    storeKeyPairs("baseKeyId", baseKeyId, preKey.keyPair)

    const signedPreKeyId = Math.floor(10000 * Math.random());
    const signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, signedPreKeyId)
    storeKeyPairs("signedPreKeyId", signedPreKeyId, signedPreKey.keyPair)

    // Now we register this with the server or other directory so all users can see them.

    const publicSignedPreKey: SignedPublicPreKeyType = {
        keyId: signedPreKeyId,
        publicKey: signedPreKey.keyPair.pubKey,
        signature: signedPreKey.signature,
    }

    const publicPreKey: PreKeyType = {
        keyId: preKey.keyId,
        publicKey: preKey.keyPair.pubKey,
    }

    const bundle: FullDirectoryEntry = {
        registrationId,
        identityKey: identityKeyPair.pubKey,
        signedPreKey: publicSignedPreKey,
        oneTimePreKeys: [publicPreKey],
    }

    fetch('/api/directory/storeKeyBundle', {
        method: "POST",
        body: JSON.stringify({ address: name, bundle: serializeKeyRegistrationBundle(bundle) })
    })
}
