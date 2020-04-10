import "./initMonaco";

import React from "react";
import ReactDOM from "react-dom";
import { App, EnvContext, defaultLayout } from "./index";
import type { Env } from "../";
import type { Files } from "..";
import type { TemplateDef } from "uniroll-types";

import { compile, InMemoryOption } from "uniroll";

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
  async save() {},
  async load() {
    return {
      files: inintialFiles,
    };
  },
  async downloadToLocal(dump: TemplateDef) {
    console.log("dowload", dump);
    const anchor = document.createElement("a");
    const blob = new Blob([JSON.stringify(dump)], { type: "text/plain" });
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `${Date.now()}.json`;
    anchor.click();
  },
  async uploadFromLocal() {
    const input = document.createElement("input");
    input.type = "file";
    return new Promise((r) => {
      input.onchange = () => {
        // @ts-ignore
        const file = input.files[0] as File;
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            const result = reader.result as string;
            const encoded = result.replace("data:application/json;base64,", "");
            const json = atob(encoded);
            const data = JSON.parse(json);
            r(data);
          },
          false
        );
        reader.readAsDataURL(file);
      };
      input.click();
    });
  },
};

ReactDOM.render(
  <EnvContext.Provider value={env}>
    <App />
  </EnvContext.Provider>,
  document.querySelector("#root")
);
