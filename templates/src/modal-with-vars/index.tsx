/** @jsx h */
// @ts-ignore
import { h, render } from "preact";
// @ts-ignore
import { useEffect, useState } from "preact/hooks";

function Counter() {
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    console.log("hello effect");
  }, []);
  return <div onClick={() => setCounter((s) => s + 1)}>{counter}</div>;
}

// @ts-ignore
import { styled, setPragma } from "goober";

setPragma(h);

const PopupWrapper = styled("div")`
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 200px;
  height: 100px;
  background-color: wheat;
`;

function Popup(props: { value: string }) {
  return (
    <PopupWrapper>
      <span>{props.value}</span>
      <Counter />
    </PopupWrapper>
  );
}

export default (options: { variables: { title: string } }) => {
  console.log(options);
  createModalElement(options.variables.title);
};

export function createModalElement(text: string) {
  const el = document.createElement("div");
  render(<Popup value={text} />, el);
  document.body.appendChild(el);
  return el;
}
