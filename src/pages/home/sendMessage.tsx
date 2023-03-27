import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import {
  encryptMessage,
  getMessagesAndDecrypt,
} from "../../utility/message/message";
import { SignalProtocolStore } from "@/utility/signalStore";
import { trpc } from "@/utility/trpc";

let store = new SignalProtocolStore();

export default function Message() {
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [other, setOther] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  const { refetch: refetchBundle } = trpc.getPreKeyBundle.procedure.useQuery(
    {
      address: other,
    },
    { enabled: false }
  );

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

  useEffect(() => {
    const name = window.localStorage.getItem("name");
    if (name === null) {
      setName("");
    } else {
      setName(name);
    }
  }, []);

  if (name == "") {
    return <div>Please login</div>;
  }

  return (
    <div>
      {name}
      <input onChange={(e) => setOther(e.target.value)}></input>
      <input onChange={(e) => setMessage(e.target.value)}></input>

      <input
        type="button"
        onClick={async () => {
          const { data } = await refetchBundle();
          const value = await encryptMessage(other, message, data!);
          mutationSendMessage.mutate({
            message: JSON.stringify(value.body!),
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
          const messages = await getMessagesAndDecrypt(data, name);
          setMessages(messages);
        }}
        value="refresh"
      ></input>

      {messages.map((message, i) => {
        return <h1 key={i}>{message}</h1>;
      })}
    </div>
  );
}
