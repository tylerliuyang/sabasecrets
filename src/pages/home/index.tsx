import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { createID } from "@/utility/identity/createID";
import { useState } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [name, setName] = useState("jerry");
  return (
    <div>
      <input
        onChange={(e) => {
          setName(e.target.value);
        }}
      ></input>
      <input
        type="button"
        onClick={() => {
          createID(name);
        }}
        value="submit"
      ></input>
    </div>
  );
}
