import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SignalProtocolStore } from "@/utility/signalStore";
import { trpc } from "@/utility/trpc";
import {
  MinMessage,
  encryptMessage,
  getMessagesAndDecrypt,
  sortMessages,
} from "@/utility/message/message";
import { loadIdentity } from "@/utility/identity/loadIdentity";
import { MessageType } from "@privacyresearch/libsignal-protocol-typescript";
import {
  getTimeStamp,
  restoreMessages,
  storeMessages,
  storeTimeStamp,
} from "@/utility/message/localstorage/localstorage";
import { loadSession, storeSession } from "@/utility/session/helper";
import {
  handleWSSMessage,
  initChannel,
  sendWSSMessage,
} from "@/utility/websockets/websocket";

export type ChatMessage = {
  message: string;
  timestamp: number;
  sender: string;
};

const Loader = () => {
  const router = useRouter();
  const recipient =
    typeof router.query.recipient === "string" ? router.query.recipient : "";

  if (recipient === "" || !router.isReady) {
    return <div>rendering...</div>;
  }
  return <Messages recipient={recipient}></Messages>;
};

export interface props {
  recipient: string;
}

// must load session info into store before usage
const Messages = (props: props) => {
  const recipient = props.recipient;
  const [store] = useState(new SignalProtocolStore());
  const [message, setMessage] = useState<string>("");

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  let _name = window.localStorage.getItem("name");
  const name = typeof _name === "string" ? _name : "";
  const { timestamp } = getTimeStamp(recipient);

  const { refetch: refetchMessagesRecv } = trpc.getMessages.procedure.useQuery(
    { reciever: name, sender: recipient, after: timestamp },
    { enabled: false }
  );

  useEffect(() => {
    // reloads messages
    const { messages } = restoreMessages(recipient);
    setMessages(messages);
    // loads keys
    loadIdentity(store);
    loadSession(recipient, store);
  }, []);

  useEffect(() => {
    // starts wss channels
    // sending
    initChannel(recipient);
    // recieving
    initChannel(name);

    // handles websocket message with a handler
    handleWSSMessage(async (payload: MinMessage) => {
      const newMessage = await getMessagesAndDecrypt(
        [payload],
        recipient,
        store
      );
      // this eats whatever messages are already existing since messages is passed by value not reference?
      console.log(messages);
      storeTimeStamp(recipient, newMessage[0].timestamp);
      setMessages([...messages, newMessage[0]]);
    }, name);
  }, []);

  useEffect(() => {
    async function OnLoadHandler() {
      const { data: dataRecv } = await refetchMessagesRecv();
      if (dataRecv === undefined || dataRecv.length === 0) {
        return;
      }
      storeTimeStamp(
        recipient,
        dataRecv.reduce((a, b) => {
          return Math.max(a, b.timestamp);
        }, -Infinity)
      );
      const newMessages = await getMessagesAndDecrypt(
        dataRecv,
        recipient,
        store
      );
      const sorted = sortMessages([...newMessages, ...messages]);
      setMessages(sorted);
    }
    OnLoadHandler();
  }, []);

  useEffect(() => {
    storeMessages(messages, recipient);
    storeSession(recipient, store);
  }, [messages]);

  const mutationSendMessage = trpc.storeMessage.procedure.useMutation();

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

          sendWSSMessage(
            JSON.stringify(sentMessage.body!),
            sentMessage.type,
            recipient
          );

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
