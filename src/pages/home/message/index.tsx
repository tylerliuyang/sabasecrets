import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { createID } from "@/pages/home/createID";
import { useEffect, useState } from "react";
import { encryptAndSendMessage } from "./message";
import { SignalProtocolStore } from "@/utility/storage-type";
const inter = Inter({ subsets: ["latin"] });

let store = new SignalProtocolStore();

export default function Message() {
  const [name, setName] = useState<string | null>();
  const [message, setMessage] = useState<string>("");
  const [other, setOther] = useState<string>("");
  useEffect(() => {
    setName(window.localStorage.getItem("name"));
  });

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
    </div>
  );
}
