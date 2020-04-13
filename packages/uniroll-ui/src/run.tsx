// import "./initMonaco";

import React from "react";
import ReactDOM from "react-dom";
import { compile, InMemoryOption } from "uniroll";
import type { Files } from "..";
import type { EnvInput } from "../";
import { UnirollEnvProvider } from "./components/contexts";
import { downloadToLocal, loadFromLocal } from "./helpers";
import { App, defaultLayout } from "./index";

const inintialFiles: Files = {
  "/style.css": `
.container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 120px 4fr 1fr;
  grid-template-rows: 60px 1fr 40px;
  grid-template-areas: 'header header header' 'left content right' 'footer footer footer';
}`,
  "/index.tsx": `/** @jsx h */
import "./style.css";
import { h } from "preact";
import { useEffect } from "preact/hooks";
console.log(<div>hello</div>, useEffect);`,
  "/variables.json": JSON.stringify([], null, 2),
  "/package.json": `{
  "dependencies": {
    "preact": "10.3.4"
  }
}`,
};

const cache = new Map();
const env: EnvInput = {
  layout: defaultLayout,
  inExtension: false,
  async compile(options: InMemoryOption) {
    return compile({
      ...options,
      cache,
      onWarn: (mes) => console.log("[warn]", mes),
      onRequest: (id) => {
        console.log("[request]", id);
      },
      onUseCache: (id) => {
        console.log("[cache]", id);
      },
    });
  },
  async loadLastState() {
    return {
      files: inintialFiles,
    };
  },
  downloadToLocal,
  loadFromLocal,
};

ReactDOM.render(
  <UnirollEnvProvider value={env}>
    <App />
  </UnirollEnvProvider>,
  document.querySelector("#root")
);
