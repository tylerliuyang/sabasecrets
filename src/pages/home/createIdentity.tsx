import { createID } from "@/utility/identity/createID";
import { useState } from "react";

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
