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
import { startSession } from "@/utility/session/startSession";
import { loadIdentity } from "@/utility/identity/loadIdentity";
import { MessageType } from "@privacyresearch/libsignal-protocol-typescript";
import {
  restoreMessages,
  storeMessages,
} from "@/utility/message/localstorage/localstorage";
import { loadSession, storeSession } from "@/utility/session/helper";
import {
  handleWSSMessage,
  initChannel,
  sendWSSMessage,
} from "@/utility/websockets/websocket";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Message } from "@prisma/client";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

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
  const [channel, setChannel] = useState<RealtimeChannel>();

  let _name = window.localStorage.getItem("name");
  const name = typeof _name === "string" ? _name : "";

  const { refetch: refetchMessagesRecv } = trpc.getMessages.procedure.useQuery(
    {
      reciever: name,
      sender: recipient,
      after: timestamp,
    },
    { enabled: false }
  );

  useEffect(() => {
    const { messages, timestamp } = restoreMessages(recipient);
    setMessages(messages);
    setTimestamp(timestamp);
    loadIdentity(store);
    loadSession(recipient, store);
  }, []);

  useEffect(() => {
    setChannel(initChannel(recipient));

    // handles websocket message with a handler
    handleWSSMessage(async (payload: MinMessage) => {
      const newMessage = await getMessagesAndDecrypt(
        [payload],
        recipient,
        store
      );
      // this eats whatever messages are already existing since messages is passed by value not reference?
      setTimestamp(newMessage[0].timestamp);
      console.log(messages);
      setMessages([...messages, newMessage[0]]);
    }, initChannel(name));
  }, []);

  useEffect(() => {
    async function temp() {
      const { data: dataRecv } = await refetchMessagesRecv();
      if (dataRecv?.length === 0 || dataRecv === undefined) {
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
    }
    temp();
  }, []);

  useEffect(() => {
    storeMessages(messages, recipient, timestamp);
    storeSession(recipient, store);
  }, [messages, timestamp]);

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
            channel!
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
