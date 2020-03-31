import React from "react";
import ReactDOM from "react-dom";
import { compile, Options } from "browserpack";
import { Env, State } from "../../packages/browserpack-ui";
import {
  EnvContext,
  App,
  useEnv,
  _react
} from "../../packages/browserpack-ui/src";
import * as chromeApi from "./env/chromeApi";

const env: Env = {
  inExtension: true,
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

function Hoge() {
  const env = useEnv();
  return <>{String(React === _react)}: </>;
}

function Root() {
  return (
    <EnvContext.Provider value={env}>
      <Hoge />
    </EnvContext.Provider>
  );
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
