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
import { deserializeKeyPairType, deserializeKeyRegistrationBundle, serializeKeyPairType, serializeKeyRegistrationBundle } from "../serialize/serialize";
import { FullDirectoryEntry, SerializedKeyPair } from "../serialize/FullDirectoryEntry";
import * as base64 from 'base64-js'
import { storeKeyPair, storeKeyPairs } from "./localstorage/localstorage";
import { DATABASE_URL } from "./url";


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

    fetch(DATABASE_URL + 'storeKeyBundle', {
        method: "POST",
        body: JSON.stringify({ address: name, bundle: serializeKeyRegistrationBundle(bundle) })
    })
}
