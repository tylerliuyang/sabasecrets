import { useState } from "react";
import { addPreKey } from "@/utility/identity/addPreKey";
import { trpc } from "@/utility/trpc";

export default function Home() {
  const [val, setVal] = useState(0);

  const mutation = trpc.addOneTimePreKeys.procedure.useMutation();

  return (
    <div>
      <input
        onChange={(e) => {
          setVal(parseInt(e.target.value));
        }}
      ></input>
      <input
        type="button"
        onClick={() => {
          addPreKey(val).then((bundle) => {
            mutation.mutate(bundle);
          });
        }}
        value="submit"
      ></input>
    </div>
  );
}
