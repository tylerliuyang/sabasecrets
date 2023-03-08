import { SignalProtocolStore } from "@/utility/signalStore";
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
import { deserializeKeyPairType, deserializeKeyRegistrationBundle, serializeKeyPairType, serializeKeyRegistrationBundle, serializePreKeyArray } from "../serialize/serialize";
import { FullDirectoryEntry, SerializedKeyPair } from "../serialize/FullDirectoryEntry";
import * as base64 from 'base64-js'
import { getKeyPair, storeKeyPairs } from "./localstorage/localstorage";
import { DATABASE_URL } from "./url";


export const addPreKey = async (num: number
    //  signalStore: SignalProtocolStore
) => {
    const name = window.localStorage.getItem('name');
    const identityKeyPair = getKeyPair('identityKey')!;

    const keys: PreKeyType[] = [];
    for (let i = 0; i < num; i++) {
        const baseKeyId = Math.floor(100000 * Math.random());
        const preKey = await KeyHelper.generatePreKey(baseKeyId)
        storeKeyPairs("baseKeyId", baseKeyId, preKey.keyPair)

        const signedPreKeyId = Math.floor(100000 * Math.random());
        const signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, signedPreKeyId)
        storeKeyPairs("signedPreKeyId", signedPreKeyId, signedPreKey.keyPair)

        const publicPreKey: PreKeyType = {
            keyId: preKey.keyId,
            publicKey: preKey.keyPair.pubKey,
        }
        keys.push(publicPreKey)
        console.log(keys);
    }

    // Now we register this with the server or other directory so all users can see them.
    fetch(DATABASE_URL + 'addOneTimePreKeys', {
        method: "POST",
        body: JSON.stringify({ address: name, keys: serializePreKeyArray(keys) })
    })

}
