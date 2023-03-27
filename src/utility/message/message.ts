import { deserializeKeyBundle } from "@/utility/serialize/serialize";
import { PublicPreKeyBundle } from "@/utility/serialize/FullDirectoryEntry";
import { DeviceType, SessionBuilder, SessionCipher, SignalProtocolAddress } from "@privacyresearch/libsignal-protocol-typescript";
import { ProcessedChatMessage } from "./types";
import { v4 as uuid } from 'uuid';
import { SignalProtocolStore } from "@/utility/signalStore";
import { getMessages, sendMessage } from "./api";
import { loadIdentity } from "../identity/loadIdentity";
import { Message } from "@prisma/client";


export async function encryptMessage(to: string, message: string, value: PublicPreKeyBundle) {
    const bundle: DeviceType = deserializeKeyBundle(value);

    let store = new SignalProtocolStore();
    loadIdentity(store);
    const address = new SignalProtocolAddress(to, 1)

    const sessionBuilder = new SessionBuilder(store, address).processPreKey(bundle);

    const cipher = new SessionCipher(store, address)

    const cm: ProcessedChatMessage = {
        id: uuid(),
        address: to,
        from: window.localStorage.getItem("name")!,
        timestamp: Date.now(),
        body: message,
    }
    // addMessageToSession(to, cm)
    const signalMessage = await cipher.encrypt(new TextEncoder().encode(JSON.stringify(cm)).buffer)
    // sendSignalProtocolMessage(to, window.localStorage.getItem("name"), signalMessage)
    return signalMessage;
}


export async function getMessagesAndDecrypt(encodedmessages: Message[], address: string) {
    let store = new SignalProtocolStore();
    loadIdentity(store);
    const cipher = new SessionCipher(store, new SignalProtocolAddress(address, 1))

    const decodedmessages: [string, number][] = [];
    for (let i in encodedmessages) {
        const plaintextBytes = await cipher.decryptPreKeyWhisperMessage(JSON.parse(encodedmessages[i].message), 'binary')
        const plaintext = new TextDecoder().decode(new Uint8Array(plaintextBytes))
        let cm = JSON.parse(plaintext) as ProcessedChatMessage
        decodedmessages.push([cm.body, cm.timestamp]);
    }

    decodedmessages.sort((a, b) => { return a[1] - b[1] });
    const orderedmessages = decodedmessages.map((a) => a[0]);
    return orderedmessages
}