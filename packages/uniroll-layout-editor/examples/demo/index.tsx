import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { LayoutEditor } from "../../src";
import { sources, gridTree } from "./mock";

const main = document.createElement("main");
const modal = document.createElement("div");

document.body.appendChild(main);
document.body.appendChild(modal);

Modal.setAppElement(modal);
ReactDOM.render(
  <>
    <style
      dangerouslySetInnerHTML={{
        __html: `
          html, body, main {padding: 0; margin: 0; width: 100vw; height: 100vh; }
          * { box-sizing: border-box; }
        `,
      }}
    />
    <LayoutEditor
      sources={sources}
      initialTree={gridTree}
      onChange={(tree) => {
        console.log("[changed]", tree);
      }}
    />
  </>,
  main
);
