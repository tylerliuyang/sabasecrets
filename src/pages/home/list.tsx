import { loadIdentity } from "@/utility/identity/loadIdentity";
import { storeSession } from "@/utility/session/helper";
import { startSession } from "@/utility/session/startSession";
import { SignalProtocolStore } from "@/utility/signalStore";
import { trpc } from "@/utility/trpc";
import { useEffect, useState } from "react";

const List = () => {
  const [recipient, setRecipient] = useState<string>("");
  const [store] = useState(new SignalProtocolStore());
  const [recipients, setRecipients] = useState<string[]>([]);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const _recipients = window.localStorage.getItem("recipients");
    const recipients =
      typeof _recipients === "string" ? JSON.parse(_recipients) : [];
    setRecipients(recipients);
    loadIdentity(store);
    let _name = window.localStorage.getItem("name");
    setName(typeof _name === "string" ? _name : "");
  }, []);

  const { refetch: fetchPreKey } = trpc.getPreKeyBundle.procedure.useQuery(
    { address: recipient },
    { enabled: false }
  );

  return (
    <div>
      user: {name}
      <input
        onChange={(e) => {
          setRecipient(e.target.value);
        }}
      ></input>
      <input
        type="button"
        value="start session!"
        onClick={async () => {
          const { data } = await fetchPreKey();
          try {
            await startSession(store, recipient, data!);
            storeSession(recipient, store);
            const _recipients = [...recipients, recipient];
            setRecipients(_recipients);
            window.localStorage.setItem(
              "recipients",
              JSON.stringify(_recipients)
            );
          } catch (e) {
            console.log("failed to establish session with " + recipient + "!");
            return;
          }
        }}
      ></input>
      <table>
        {recipients.map((recipient_name, i) => {
          return (
            <tr key={i}>
              <th key={i}>{recipient_name}</th>
              <th key={i}>
                <a href={"/home/message/" + recipient_name}>
                  Click here to access chat!
                </a>
              </th>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default List;
