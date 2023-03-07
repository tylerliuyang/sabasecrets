import { deserializeKeyPairType, serializeKeyPairType } from "@/utility/serialize/serialize";
import { SerializedKeyPair } from "@/utility/serialize/FullDirectoryEntry";
import {
    KeyPairType,
} from "@privacyresearch/libsignal-protocol-typescript";
import * as base64 from 'base64-js'


export const storeKeyPair = (name: string, KeyPair: KeyPairType) => {
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
    let values: { [id: number]: SerializedKeyPair } = {};

    const localstorage = window.localStorage.getItem(name);
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
