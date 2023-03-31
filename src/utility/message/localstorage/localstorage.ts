interface Message {
    sender: string;
    message: string;
    timestamp: number;
}

const storeMessages = (
    messages: Message[],
    convo: string,
    timestamp: number
): void => {
    window.localStorage.setItem(convo, JSON.stringify(messages));
    window.localStorage.setItem(convo + "time", JSON.stringify(timestamp));
};

const restoreMessages = (convo: string) => {
    const messages = window.localStorage.getItem(convo);
    const parsedmessages = messages !== null ? JSON.parse(messages) : [];
    const timestamp = window.localStorage.getItem(convo + "time");
    const parsedtimestamp = timestamp !== null ? JSON.parse(timestamp) : 0;

    return { messages: parsedmessages, timestamp: parsedtimestamp };
};
