import { SessionBuilder, SessionCipher, SignalProtocolAddress } from "@privacyresearch/libsignal-protocol-typescript"
import { PublicPreKeyBundle } from "../serialize/FullDirectoryEntry"
import { deserializeKeyBundle } from "../serialize/serialize"
import { SignalProtocolStore } from "../signalStore"

export async function startSession(store: SignalProtocolStore, recipient: string, key: PublicPreKeyBundle): Promise<void> {
    const recipientAddress = new SignalProtocolAddress(recipient, 1)

    // Instantiate a SessionBuilder for a remote recipientId + deviceId tuple.
    const sessionBuilder = new SessionBuilder(store, recipientAddress)

    // Process a prekey fetched from the server. Returns a promise that resolves
    // once a session is created and saved in the store, or rejects if the
    // identityKey differs from a previously seen identity for this address.
    const bundle = deserializeKeyBundle(key);
    const session = await sessionBuilder.processPreKey(bundle);
}