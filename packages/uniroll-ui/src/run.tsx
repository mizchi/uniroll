import "./initMonaco";

import React from "react";
import ReactDOM from "react-dom";
import { App, EnvContext, defaultLayout } from "./index";
import { Env } from "../";
import { compile, InMemoryOption } from "uniroll";
import { Files } from "..";

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
const env: Env = {
  templateHost:
    "https://raw.githubusercontent.com/mizchi/uniroll/master/templates/gen",
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
  async save() {},
  async load() {
    return {
      files: inintialFiles,
    };
  },
  layout: defaultLayout,
};

ReactDOM.render(
  <EnvContext.Provider value={env}>
    <App />
  </EnvContext.Provider>,
  document.querySelector("#root")
);
