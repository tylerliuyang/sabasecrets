import { useEffect, useState } from "react";
import Messages from "./[recipient]";

const Menu = () => {
  const [recipient, setRecipient] = useState<string>("");
  const [render, setRender] = useState<boolean>(false);

  useEffect(() => {
    console.log(window.localStorage.getItem(recipient + "messages"));
  }, [recipient]);

  if (render) {
    <input
      type="button"
      onClick={() => {
        setRender(false);
      }}
      value="back"
    ></input>;
    return <Messages recipient={recipient}></Messages>;
  }
  return (
    <div>
      <input
        onChange={(e) => {
          setRecipient(e.target.value);
        }}
      ></input>
      <input
        type="button"
        onClick={() => {
          setRender(true);
        }}
        value="message?"
      ></input>
    </div>
  );
};
export default Menu;
