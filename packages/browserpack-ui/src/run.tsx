import React from "react";
import ReactDOM from "react-dom";
import { App, EnvContext } from "./index";
import { Env } from "..";
import { compile, Options } from "browserpack";

const env: Env = {
  inExtension: false,
  async compile(options: Options) {
    return compile(options)
  },
  async save() {
  },
  async load() {
    return {
      files: { "/index.tsx": "console.log('hello');" }
    }
  }
}

ReactDOM.render(
  <EnvContext.Provider value={env}>
    <App />
  </EnvContext.Provider>,
  document.querySelector("#root")
);