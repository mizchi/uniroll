import "./initMonaco";

import React from "react";
import ReactDOM from "react-dom";
import { App, EnvContext } from "./index";
import { Env } from "./types";
import { compile, InMemoryOption } from "uniroll";
import { Files } from "..";

function readDepenedenciesIfExists(
  files: Files
): { [library: string]: string } {
  try {
    const pkgStr = files["/package.json"];
    const parsed = JSON.parse(pkgStr) as any;
    return parsed.dependencies || {};
  } catch (err) {
    return {};
  }
}

const inintialFiles = {
  "/index.tsx": `/** @jsx h */
import { h } from "preact";
import { useEffect } from "preact/hooks";
console.log(<div>hello</div>, useEffect);`,

  "/package.json": `{
  "dependencies": {
    "preact": "10.3.4"
  }
}`
};

const cache = new Map();
const env: Env = {
  templateHost:
    "https://raw.githubusercontent.com/mizchi/uniroll/master/templates/gen",
  inExtension: false,
  async compile(options: InMemoryOption) {
    const versions = readDepenedenciesIfExists(options.files);
    return compile({ ...options, versions, cache: cache as any });
  },
  async save() {},
  async load() {
    return {
      files: inintialFiles
    };
  }
};

ReactDOM.render(
  <EnvContext.Provider value={env}>
    <App />
  </EnvContext.Provider>,
  document.querySelector("#root")
);
