import { deserializeKeyBundle, PublicPreKeyBundle } from "@/utility/serialize";
import { DeviceType, SessionBuilder, SessionCipher, SignalProtocolAddress } from "@privacyresearch/libsignal-protocol-typescript";
import { ProcessedChatMessage } from "./types";
import { v4 as uuid } from 'uuid';
import { SignalProtocolStore } from "@/utility/storage-type";
import { sendMessage } from "./api";
import { loadIdentity } from "../loadIdentity";

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

    console.log(bundle);
    console.log(bundle.identityKey);
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

// export function getMessagesAndDecrypt(address)