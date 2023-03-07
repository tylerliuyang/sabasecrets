import { deserializeKeyBundle } from "@/utility/serialize";
import { PublicPreKeyBundle } from "@/utility/serialize/types";
import { DeviceType, SessionBuilder, SessionCipher, SignalProtocolAddress } from "@privacyresearch/libsignal-protocol-typescript";
import { ProcessedChatMessage } from "./types";
import { v4 as uuid } from 'uuid';
import { SignalProtocolStore } from "@/utility/signalStore";
import { sendMessage } from "./api";
import { loadIdentity } from "../identity/loadIdentity";

export async function encryptAndSendMessage(to: string, message: string): Promise<void> {
    const value = await fetch('/api/directory/getPreKeyBundle', {
        method: "POST",
        body: JSON.stringify({ address: to })
    });
    const a: PublicPreKeyBundle = JSON.parse(await value.json());
    const bundle: DeviceType = deserializeKeyBundle(a);

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
    sendMessage(to, signalMessage.body!);
}

interface res {
    message: [string]
}

export async function getMessagesAndDecrypt(address: string) {
    const res = await fetch('/api/messages/getMessages', {
        method: "POST",
        body: JSON.stringify({ address: address })
    })
    const encodedmessages: res = await res.json();
    console.log(encodedmessages);

    let store = new SignalProtocolStore();
    loadIdentity(store);
    const cipher = new SessionCipher(store, new SignalProtocolAddress(address, 1))

    const decodedmessages: string[] = [];
    for (let i in encodedmessages.message) {
        const plaintextBytes = await cipher.decryptPreKeyWhisperMessage(encodedmessages.message[i], 'binary')
        const plaintext = new TextDecoder().decode(new Uint8Array(plaintextBytes))
        let cm = JSON.parse(plaintext) as ProcessedChatMessage
        decodedmessages.push(cm.body);
    }
    return decodedmessages
}