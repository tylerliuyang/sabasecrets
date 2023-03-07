import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { createID } from "@/utility/identity/createID";
import { useEffect, useState } from "react";
import {
  encryptAndSendMessage,
  getMessagesAndDecrypt,
} from "../../../utility/message/message";
import { SignalProtocolStore } from "@/utility/storage-type";
const inter = Inter({ subsets: ["latin"] });

let store = new SignalProtocolStore();

export default function Message() {
  const [name, setName] = useState<string | null>();
  const [message, setMessage] = useState<string>("");
  const [other, setOther] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

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
        onClick={() => encryptAndSendMessage(other, message)}
        value="submit"
      ></input>
      <input
        type="button"
        onClick={() => {
          getMessagesAndDecrypt(name).then((v) => {
            setMessages(v);
            console.log(v);
            console.log(messages);
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
