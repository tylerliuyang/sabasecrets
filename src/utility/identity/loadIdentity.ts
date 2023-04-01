import { SignalProtocolStore } from "@/utility/signalStore";
import { getKeyPair, getKeyPairs } from "./localstorage/localstorage";

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

}
