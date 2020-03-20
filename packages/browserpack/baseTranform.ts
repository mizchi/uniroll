// @ts-ignore
import env from "@babel/preset-env";
// @ts-ignore
import ts from "@babel/preset-typescript";
// @ts-ignore
import react from "@babel/preset-react";

import { transform as transformBabel } from "@babel/core";

export async function transform(code: string, id: string) {
  const ret = transformBabel(code, {
    filename: id,
    plugins: [],
    presets: [[env, { modules: false }], react, ts]
  });
  return ret && (ret.code as string);
}
