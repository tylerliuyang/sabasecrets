import { useState } from "react";
import Messages from "./[recipient]";

const Menu = () => {
  const [recipient, setRecipient] = useState<string>("");

  if (recipient === "") {
    return (
      <input
        onChange={(e) => {
          setRecipient(e.target.value);
        }}
      ></input>
    );
  } else {
    return <Messages></Messages>;
  }
};
