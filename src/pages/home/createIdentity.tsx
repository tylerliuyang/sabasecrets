import { createID } from "@/utility/identity/createID";
import { SerializedFullDirectoryEntry } from "@/utility/serialize/FullDirectoryEntry";
import { trpc } from "@/utility/trpc";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("jerry");

  const mutation = trpc.storeKeyBundle.procedure.useMutation();

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
          createID(name).then((bundle) => {
            mutation.mutate(bundle);
          });
        }}
        value="submit"
      ></input>
    </div>
  );
}
