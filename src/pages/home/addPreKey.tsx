import { useState } from "react";
import { addPreKey } from "@/utility/identity/addPreKey";

export default function Home() {
  const [val, setVal] = useState(0);
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
          console.log(val);
          addPreKey(val);
        }}
        value="submit"
      ></input>
    </div>
  );
}
