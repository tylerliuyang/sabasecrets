import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import {
  encryptAndSendMessage,
  getMessagesAndDecrypt,
} from "../../utility/message/message";
import { SignalProtocolStore } from "@/utility/signalStore";
import { trpc } from "@/utility/trpc";

let store = new SignalProtocolStore();

export default function Message() {
  const [name, setName] = useState<string | null>();
  const [message, setMessage] = useState<string>("");
  const [other, setOther] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  const { data, refetch } = trpc.getPreKeyBundle.procedure.useQuery(
    {
      address: other,
    },
    { enabled: false }
  );

  useEffect(() => {
    setName(window.localStorage.getItem("name"));
  }, []);

  if (name == null) {
    return <div>Please login</div>;
  }

  return (
    <div>
      {name}
      <input onChange={(e) => setOther(e.target.value)}></input>
      <input onChange={(e) => setMessage(e.target.value)}></input>

      <input
        type="button"
        onClick={() => {
          refetch().then(({ data }) => {
            encryptAndSendMessage(other, message, data!);
          });
          setMessages([...messages, message]);
        }}
        value="submit"
      ></input>

      <input
        type="button"
        onClick={() => {
          getMessagesAndDecrypt(name).then((v) => {
            setMessages(v);
          });
        }}
        value="refresh"
      ></input>

      {messages.map((message, i) => {
        return <h1 key={i}>{message}</h1>;
      })}
    </div>
  );
}
