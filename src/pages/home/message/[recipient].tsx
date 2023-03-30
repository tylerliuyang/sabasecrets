import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SignalProtocolStore } from "@/utility/signalStore";
import { trpc } from "@/utility/trpc";
import {
  encryptMessage,
  getMessagesAndDecrypt,
} from "@/utility/message/message";
import { startSession } from "@/utility/session/startSession";
import { loadIdentity } from "@/utility/identity/loadIdentity";
import { MessageType } from "@privacyresearch/libsignal-protocol-typescript";

const store = new SignalProtocolStore();
// must load session info into store before usage
const Messages = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [reciever, setReciever] = useState<string>("");

  useEffect(() => {
    loadIdentity(store);

    const name = window.localStorage.getItem("name");
    setName(name === null ? "" : name);
  }, []);

  const getPreKeyMutation = trpc.getPreKeyBundle.procedure.useMutation();

  const mutationSendMessage = trpc.storeMessage.procedure.useMutation();

  const { refetch: refetchMessagesSent } = trpc.getMessages.procedure.useQuery(
    {
      reciever: reciever,
      sender: name,
    },
    { enabled: false }
  );

  const { refetch: refetchMessagesRecv } = trpc.getMessages.procedure.useQuery(
    {
      reciever: name,
      sender: reciever,
    },
    { enabled: false }
  );

  // gets the recipient from url
  const router = useRouter();
  if (router.isReady && reciever === "") {
    const reciever =
      typeof router.query.recipient === "string" ? router.query.recipient : "";
    setReciever(reciever);
  }

  // once loaded, only get prekey *once*
  if (
    reciever !== "" &&
    !getPreKeyMutation.isLoading &&
    !getPreKeyMutation.isError &&
    getPreKeyMutation.data === undefined
  ) {
    getPreKeyMutation.mutate({ address: reciever });
    // getPreKeyMutation.
  }

  const [init, setInit] = useState(false);
  // once mutation is done, start session!
  if (getPreKeyMutation.data !== undefined && !init) {
    setInit(true);
    startSession(store, reciever, getPreKeyMutation.data).then((ct) => {
      mutationSendMessage.mutate({
        message: JSON.stringify(ct.body!),
        type: ct.type,
        reciever: reciever,
        sender: name,
      });
    });
  }

  // router.isReady removes flashing from render
  if (name === "" && router.isReady) {
    return <div>Please login</div>;
  }
  if (reciever === "" && router.isReady) {
    return <div>Please input a string as the other user</div>;
  }

  return (
    <div>
      {name}
      <input onChange={(e) => setMessage(e.target.value)}></input>

      <input
        type="button"
        onClick={async () => {
          const sentMessage: MessageType = await encryptMessage(
            reciever,
            message,
            store
          );
          mutationSendMessage.mutate({
            message: JSON.stringify(sentMessage.body!),
            sender: name,
            reciever: reciever,
            type: sentMessage.type,
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
