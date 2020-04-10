import "./__pre";
import "./initMonaco";

import React from "react";
import ReactDOM from "react-dom";
import { compile, Options, InMemoryOption } from "uniroll";
// @ts-ignore
import { Env, State } from "uniroll-ui/lib";
import { EnvContext, App, UnirollEnvProvider, EnvInput } from "uniroll-ui";
import * as chromeApi from "./env/chromeApi";

function readDepenedenciesIfExists(files: any): { [library: string]: string } {
  try {
    const pkgStr = files["/package.json"];
    const parsed = JSON.parse(pkgStr) as any;
    return parsed.dependencies || {};
  } catch (err) {
    return {};
  }
}

const cache = new Map();
const env: EnvInput = {
  inExtension: true,
  templateHost:
    "https://raw.githubusercontent.com/mizchi/uniroll/master/templates/gen",
  evalCodeInActiveTab: chromeApi.evalCodeInActiveTab,
  async compile(options: InMemoryOption) {
    const versions = readDepenedenciesIfExists(options.files);
    return compile({ ...options, versions, cache: cache as any });
  },
  async saveCurrentState(state: State) {
    await chromeApi.save(state);
  },
  async loadLastState() {
    return chromeApi.load();
  },
};

function Root() {
  return (
    <UnirollEnvProvider value={env}>
      <App />
    </UnirollEnvProvider>
  );
}

try {
  ReactDOM.render(<Root />, document.querySelector("#root"));
} catch (err) {
  document.body.textContent = `<div style="padding: 100px"> ${err.message}</div>`;
  console.error(err);
}
