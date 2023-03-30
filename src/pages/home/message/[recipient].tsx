import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SignalProtocolStore } from "@/utility/signalStore";
import { trpc } from "@/utility/trpc";
import {
  encryptMessage,
  getMessagesAndDecrypt,
} from "@/utility/message/message";
import { startSession } from "@/utility/session/startSession";
import { loadIdentity } from "@/utility/identity/loadIdentity";
import { MessageType } from "@privacyresearch/libsignal-protocol-typescript";

// must load session info into store before usage
const Messages = () => {
  const [store] = useState(new SignalProtocolStore());
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [name, setName] = useState<string>("");

  async function start() {
    const { data } = await refetchPreKey();
    const ct = await startSession(store, recipient, data!);

    // mutationSendMessage.mutate({
    //   message: JSON.stringify(ct.body!),
    //   type: ct.type,
    //   reciever: recipient,
    //   sender: name!,
    // });
  }

  useEffect(() => {
    const name = window.localStorage.getItem("name");
    setName(name === null ? "" : name);
    loadIdentity(store);
  }, []);

  const router = useRouter();
  const recipient =
    typeof router.query.recipient === "string" ? router.query.recipient : "";

  const { refetch: refetchPreKey } = trpc.getPreKeyBundle.procedure.useQuery(
    { address: recipient },
    { enabled: false }
  );

  const mutationSendMessage = trpc.storeMessage.procedure.useMutation();

  const { refetch: refetchMessagesSent } = trpc.getMessages.procedure.useQuery(
    {
      reciever: recipient,
      sender: name,
    },
    { enabled: false }
  );

  const { refetch: refetchMessagesRecv } = trpc.getMessages.procedure.useQuery(
    {
      reciever: name,
      sender: recipient,
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

      <input
        type="button"
        onClick={() => {
          start();
        }}
        value="start session"
      ></input>
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
          });
          setMessages([...messages, message]);
        }}
        value="submit"
      ></input>

      <input
        type="button"
        onClick={async () => {
          const { data: dataSent } = await refetchMessagesSent();
          const { data: dataRecv } = await refetchMessagesRecv();

          const data = [...dataSent!, ...dataRecv!];
          const messages = await getMessagesAndDecrypt(data, recipient, store);
          setMessages(messages);
        }}
        value="refresh"
      ></input>

      {messages.map((message, i) => {
        return <h1 key={i}>{message}</h1>;
      })}
    </div>
  );
};

export default Messages;
