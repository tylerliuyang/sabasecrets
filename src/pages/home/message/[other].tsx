import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { SignalProtocolStore } from "@/utility/signalStore";
import { trpc } from "@/utility/trpc";
import {
  encryptMessage,
  getMessagesAndDecrypt,
} from "@/utility/message/message";
import { startSession } from "@/utility/session/startSession";
import { loadIdentity } from "@/utility/identity/loadIdentity";

let store = new SignalProtocolStore();
loadIdentity(store);
// must load session info into store before usage
const Messages = () => {
  const router = useRouter();
  const name = window.localStorage.getItem("name");
  const { other } = router.query;

  if (typeof name !== "string") {
    return <div>Please login</div>;
  }
  if (typeof other !== "string") {
    return <div>Please input a string as the other user</div>;
  }

  useEffect(() => {
    const { data } = trpc.getPreKeyBundle.procedure.useQuery({
      address: other,
    });
    startSession(store, other, data!);
  }, []);

  const mutationSendMessage = trpc.storeMessage.procedure.useMutation();

  const { refetch: refetchMessagesSent } = trpc.getMessages.procedure.useQuery(
    {
      reciever: other,
      sender: name,
    },
    { enabled: false }
  );

  const { refetch: refetchMessagesRecv } = trpc.getMessages.procedure.useQuery(
    {
      reciever: name,
      sender: other,
    },
    { enabled: false }
  );

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  return (
    <div>
      {name}
      <input onChange={(e) => setMessage(e.target.value)}></input>

      <input
        type="button"
        onClick={async () => {
          const sentMessage = await encryptMessage(other, message, store);
          mutationSendMessage.mutate({
            message: JSON.stringify(sentMessage.body!),
            sender: name,
            reciever: other,
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
          const messages = await getMessagesAndDecrypt(data, name, store);
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
