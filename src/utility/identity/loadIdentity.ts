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
import { deserializeKeyRegistrationBundle, FullDirectoryEntry, serializeKeyRegistrationBundle } from "../serialize";
import { getKeyPair, getKeyPairs } from "./createID";

export const loadIdentity = async (signalStore: SignalProtocolStore) => {
    // storage in localstorage please fix
    const registrationId = window.localStorage.getItem(`registrationID`);
    signalStore.put(`registrationID`, parseInt(registrationId!))

    const identityKeyPair = getKeyPair('identityKey');
    signalStore.put('identityKey', identityKeyPair);

    const preKeys = getKeyPairs("baseKeyId")!;
    for (let key in preKeys) {
        signalStore.storePreKey(`${key}`, preKeys[key])
    }

    const signedPreKeys = getKeyPairs("signedPreKeyId")!;
    for (let key in signedPreKeys) {
        signalStore.storeSignedPreKey(key, signedPreKeys[key])
    }

    // const preKey = await KeyHelper.generatePreKey(baseKeyId)
    // getKeyPair(`${baseKeyId}`)
    // signalStore.storePreKey(`${baseKeyId}`, preKey.keyPair)

    // const signedPreKeyId = Math.floor(10000 * Math.random());
    // const signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, signedPreKeyId)
    // storeKeyPair(`${signedPreKeyId}`, signedPreKey.keyPair)
    // signalStore.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair)

    // Now we register this with the server or other directory so all users can see them.
}
