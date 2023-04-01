interface Message {
    sender: string;
    message: string;
    timestamp: number;
}

export const storeMessages = (
    messages: Message[],
    convo: string,
    timestamp: number
): void => {
    if (messages.length === 0 || timestamp === null) { return }
    window.localStorage.setItem(convo + "messages", JSON.stringify(messages));
    window.localStorage.setItem(convo + "time", JSON.stringify(timestamp));
};


export const restoreMessages = (convo: string) => {
    const messages = window.localStorage.getItem(convo + "messages");
    const parsedmessages = messages !== null ? JSON.parse(messages) : [];
    const timestamp = window.localStorage.getItem(convo + "time");
    const parsedtimestamp = timestamp !== null ? JSON.parse(timestamp) : 0;

    return { messages: parsedmessages, timestamp: parsedtimestamp };
};
