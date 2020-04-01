/** @jsx h */
// @ts-ignore
import { h, render } from "preact";
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
  return <PopupWrapper>{props.value}</PopupWrapper>;
}

export default (options: any) => {
  console.log(options);
  createModalElement(`hello`);
};

export function createModalElement(text: string) {
  const el = document.createElement("div");
  render(<Popup value={text} />, el);
  document.body.appendChild(el);
  return el;
}
