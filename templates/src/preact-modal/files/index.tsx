/** @jsx h */
// @ts-ignore
import { h, render } from "preact";
export default (options: any) => {
  console.log(options);
  createModalElement(`hello`);
};

export function createModalElement(text: string) {
  const el = document.createElement("div");
  render(
    <div
      style={{
        position: "absolute",
        right: "10px",
        bottom: "10px",
        width: "200px",
        height: "100px",
        backgroundColor: "wheat"
      }}
    >
      {text}
    </div>,
    el
  );
  document.body.appendChild(el);
  return el;
}
