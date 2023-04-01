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
import {
  restoreMessages,
  storeMessages,
} from "@/utility/message/localstorage/localstorage";
import { loadSession, storeSession } from "@/utility/session/helper";

export type ChatMessage = {
  message: string;
  timestamp: number;
  sender: string;
};

export interface props {
  recipient: string;
}

const Loader = () => {
  const router = useRouter();
  const recipient =
    typeof router.query.recipient === "string" ? router.query.recipient : "";

  if (recipient === "" || !router.isReady) {
    return <div>rendering...</div>;
  }
  return <Messages recipient={recipient}></Messages>;
};
// must load session info into store before usage
const Messages = (props: props) => {
  const recipient = props.recipient;
  const [store] = useState(new SignalProtocolStore());
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [timestamp, setTimestamp] = useState<number>(0);

  let _name = window.localStorage.getItem("name");
  const name = typeof _name === "string" ? _name : "";

  useEffect(() => {
    const { messages, timestamp } = restoreMessages(recipient);
    setMessages(messages);
    setTimestamp(timestamp);
    loadIdentity(store);
    loadSession(recipient, store);
  }, []);

  useEffect(() => {
    storeMessages(messages, recipient, timestamp);
    storeSession(recipient, store);
  }, [messages, timestamp]);

  const mutationSendMessage = trpc.storeMessage.procedure.useMutation();

  const { refetch: refetchMessagesRecv } = trpc.getMessages.procedure.useQuery(
    {
      reciever: name,
      sender: recipient,
      after: timestamp,
    },
    { enabled: false }
  );

  if (name === "") {
    return <div>Please login</div>;
  }
  if (recipient === "") {
    return <div>Please input a string as the other user</div>;
  }

  return (
    <div>
      {name}
      <input onChange={(e) => setMessage(e.target.value)}></input>

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
          if (dataRecv?.length === 0) {
            return;
          }
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
            <tr key={i}>
              <th key={i + "sender"}>{message.sender}</th>
              <th key={i + "message"}>{message.message}</th>
              <th key={i + "timestamp"}>{message.timestamp}</th>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default Loader;
