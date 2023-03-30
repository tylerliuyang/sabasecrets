import { SessionBuilder, SessionCipher, SignalProtocolAddress } from "@privacyresearch/libsignal-protocol-typescript"
import { PublicPreKeyBundle } from "../serialize/FullDirectoryEntry"
import { deserializeKeyBundle } from "../serialize/serialize"
import { SignalProtocolStore } from "../signalStore"

export async function startSession(store: SignalProtocolStore, recipient: string, key: PublicPreKeyBundle) {
    const recipientAddress = new SignalProtocolAddress(recipient, 1)

    // Instantiate a SessionBuilder for a remote recipientId + deviceId tuple.
    const sessionBuilder = new SessionBuilder(store, recipientAddress)

    // Process a prekey fetched from the server. Returns a promise that resolves
    // once a session is created and saved in the store, or rejects if the
    // identityKey differs from a previously seen identity for this address.
    const bundle = deserializeKeyBundle(key);
    await sessionBuilder.processPreKey(bundle);

    // start session with message send
    const senderSessionCipher = new SessionCipher(store, recipientAddress)
    // const ciphertext = await senderSessionCipher.encrypt(new Uint8Array([0, 0, 0, 0]).buffer)
    // return ciphertext;
    // The message is encrypted, now send it however you like.
}