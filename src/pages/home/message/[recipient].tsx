import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SignalProtocolStore } from "@/utility/signalStore";
import { trpc } from "@/utility/trpc";
import {
  encryptMessage,
  getMessagesAndDecrypt,
  sortMessages,
} from "@/utility/message/message";
import { startSession } from "@/utility/session/startSession";
import { loadIdentity } from "@/utility/identity/loadIdentity";
import { MessageType } from "@privacyresearch/libsignal-protocol-typescript";

export type ChatMessage = {
  message: string;
  timestamp: number;
  sender: string;
};

// must load session info into store before usage
const Messages = () => {
  const [store] = useState(new SignalProtocolStore());
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [name, setName] = useState<string>("");
  const [timestamp, setTimestamp] = useState<number>(0);

  useEffect(() => {
    const name = window.localStorage.getItem("name");
    setName(name === null ? "" : name);
    loadIdentity(store);
    const { messages, timestamp } = restoreMessages(recipient);
  }, []);

  useEffect(() => {
    storeMessages(messages, recipient, timestamp);
  }, [messages, timestamp]);

  const router = useRouter();
  const recipient =
    typeof router.query.recipient === "string" ? router.query.recipient : "";

  const { refetch: refetchPreKey } = trpc.getPreKeyBundle.procedure.useQuery(
    { address: recipient },
    { enabled: false }
  );

  const mutationSendMessage = trpc.storeMessage.procedure.useMutation();

  const { refetch: refetchMessagesRecv } = trpc.getMessages.procedure.useQuery(
    {
      reciever: name,
      sender: recipient,
      after: timestamp,
    },
    { enabled: false }
  );

  // router.isReady removes flashing from render
  if (name === "" && router.isReady) {
    return <div>Please login</div>;
  }
  if (recipient === "" && router.isReady) {
    return <div>Please input a string as the other user</div>;
  }

  return (
    <div>
      {name}
      <input onChange={(e) => setMessage(e.target.value)}></input>

      {/* starts session */}
      <input
        type="button"
        onClick={async () => {
          const { data } = await refetchPreKey();
          await startSession(store, recipient, data!);
        }}
        value="start session"
      ></input>

      {/* sends message and stores message locally! */}
      <input
        type="button"
        onClick={async () => {
          const sentMessage: MessageType = await encryptMessage(
            recipient,
            message,
            store
          );
          mutationSendMessage.mutate({
            message: JSON.stringify(sentMessage.body!),
            sender: name,
            reciever: recipient,
            type: sentMessage.type,
            timestamp: Date.now(),
          });
          setMessages([
            ...messages,
            {
              message: message,
              sender: name,
              timestamp: Date.now(),
            },
          ]);
        }}
        value="submit"
      ></input>

      {/* gets messages in inbox and decrypts */}
      <input
        type="button"
        onClick={async () => {
          const { data: dataRecv } = await refetchMessagesRecv();
          setTimestamp(
            dataRecv!.reduce((a, b) => {
              return Math.max(a, b.timestamp);
            }, -Infinity)
          );
          const newMessages = await getMessagesAndDecrypt(
            dataRecv!,
            recipient,
            store
          );
          const sorted = sortMessages([...newMessages, ...messages]);
          setMessages(sorted);
        }}
        value="refresh"
      ></input>
      <table>
        {messages.map((message, i) => {
          return (
            <tr>
              <th key={i}>{message.sender}</th>
              <th key={i}>{message.message}</th>
              <th key={i}>{message.timestamp}</th>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default Messages;
