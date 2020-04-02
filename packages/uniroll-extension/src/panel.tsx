import "./__pre";
import "./initMonaco";

import React from "react";
import ReactDOM from "react-dom";
import { compile, Options } from "uniroll";
// @ts-ignore
import { Env, State } from "uniroll-ui/lib";
// @ts-ignore
import { EnvContext, App, useEnv } from "uniroll-ui/lib";
import * as chromeApi from "./env/chromeApi";

const env: Env = {
  inExtension: true,
  evalCodeInActiveTab: chromeApi.evalCodeInActiveTab,
  async compile(options: Options) {
    return compile(options);
  },
  async save(state: State) {
    await chromeApi.save(state);
  },
  async load() {
    return chromeApi.load();
  }
};

function Root() {
  return (
    <EnvContext.Provider value={env}>
      <App />
    </EnvContext.Provider>
  );
}

try {
  ReactDOM.render(<Root />, document.querySelector("#root"));
} catch (err) {
  document.body.textContent = `<div style="padding: 100px"> ${err.message}</div>`;
  console.error(err);
}
