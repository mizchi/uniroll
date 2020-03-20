/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";

console.log(useEffect);

function Counter() {
  const [state, setState] = useState(0);

  return <div>{state}</div>;
}

export default Counter;
