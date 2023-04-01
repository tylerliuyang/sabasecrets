import { deserializeKeyBundle } from "@/utility/serialize/serialize";
import { PublicPreKeyBundle } from "@/utility/serialize/FullDirectoryEntry";
import { DeviceType, SessionBuilder, SessionCipher, SignalProtocolAddress } from "@privacyresearch/libsignal-protocol-typescript";
import { ProcessedChatMessage } from "./types";
import { v4 as uuid } from 'uuid';
import { SignalProtocolStore } from "@/utility/signalStore";
import { loadIdentity } from "../identity/loadIdentity";
import { Message } from "@prisma/client";
import { ChatMessage } from "@/pages/home/message/[recipient]";


export async function encryptMessage(to: string, message: string, store: SignalProtocolStore) {
    const address = new SignalProtocolAddress(to, 1);
    const cipher = new SessionCipher(store, address);

    const cm: ProcessedChatMessage = {
        id: uuid(),
        address: to,
        from: window.localStorage.getItem("name")!,
        timestamp: Date.now(),
        body: message,
    };

    const signalMessage = await cipher.encrypt(new TextEncoder().encode(JSON.stringify(cm)).buffer);
    return signalMessage;
}


export async function getMessagesAndDecrypt(encodedmessages: Message[], address: string, store: SignalProtocolStore) {
    const cipher = new SessionCipher(store, new SignalProtocolAddress(address, 1))

    const decodedmessages: ProcessedChatMessage[] = [];
    for (let i in encodedmessages) {
        let plaintextBytes = undefined;
        if (encodedmessages[i].type === 3) {
            plaintextBytes = await cipher.decryptPreKeyWhisperMessage(JSON.parse(encodedmessages[i].message), 'binary')
        } else { // (encodedmessages[i].type === 1)
            plaintextBytes = await cipher.decryptWhisperMessage(JSON.parse(encodedmessages[i].message), 'binary')
        }
        const plaintext = new TextDecoder().decode(new Uint8Array(plaintextBytes))
        let cm = JSON.parse(plaintext) as ProcessedChatMessage
        decodedmessages.push(cm);
    }

    // sorting is not needed as long as you sort later
    // decodedmessages.sort((a, b) => { return a.timestamp - b.timestamp });
    const orderedmessages: ChatMessage[] = decodedmessages.map((a) => { return { message: a.body, sender: a.from, timestamp: a.timestamp } });
    return orderedmessages;
}


export const sortMessages = (messages: ChatMessage[]) => {
    messages.sort((a, b) => { return a.timestamp - b.timestamp });
    return messages;
}