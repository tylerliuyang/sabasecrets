import { SignalProtocolStore } from "../signalStore";


// gets recipient.1 from store, then stores in localstorage
export const storeSession = async (recipient: string, store: SignalProtocolStore) => {
    const session = await store.loadSession(recipient + ".1");
    if (typeof session === "string") {
        window.localStorage.setItem(recipient + "session", session);
    } else {
        throw Error;
    }
}

// mutably adds the session of recipient to store, if exists
export const loadSession = (recipient: string, store: SignalProtocolStore) => {
    const session = window.localStorage.getItem(recipient + "session");
    if (typeof session === "string") {
        store.storeSession(recipient + ".1", session);
    }
}