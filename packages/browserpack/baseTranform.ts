// @ts-ignore
import env from "@babel/preset-env";
// @ts-ignore
import ts from "@babel/preset-typescript";
// @ts-ignore
import react from "@babel/preset-react";

// require("@babel/plugin-proposal-class-properties"),
// require("@babel/plugin-proposal-object-rest-spread"),
// require("@babel/plugin-proposal-nullish-coalescing-operator")

import { transform as transformBabel } from "@babel/core";
import { transformImportPathToCdn } from "babel-plugin-transform-import-to-cdn";

export async function transform(code: string, id: string) {
  const ret = transformBabel(code, {
    filename: id,
    plugins: [transformImportPathToCdn({ preact: "10.3.4" })],
    presets: [[env, { modules: false }], react, ts]
  });
  return ret && (ret.code as string);
}
