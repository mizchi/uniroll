// @ts-ignore
import env from "@babel/preset-env";
// @ts-ignore
import ts from "@babel/preset-typescript";
// @ts-ignore
import react from "@babel/preset-react";
// @ts-ignore
import classProperties from "@babel/plugin-proposal-class-properties";
// @ts-ignore
import objectRestSpread from "@babel/plugin-proposal-object-rest-spread";
// @ts-ignore
import nullishCoalescing from "@babel/plugin-proposal-nullish-coalescing-operator";

import { transform as transformBabel, TransformOptions } from "@babel/core";
import { transformImportPathToPikaCDN } from "babel-plugin-transform-import-to-pika-cdn";

export function createTransformer(options?: TransformOptions) {
  return async (code: string, id: string) => {
    const ret = transformBabel(code, {
      filename: id,
      plugins: [
        classProperties,
        objectRestSpread,
        nullishCoalescing,
        transformImportPathToPikaCDN({ preact: "10.3.4" })
      ],
      presets: [[env, { modules: false, bugfixes: true }], react, ts],
      ...options
    });
    return ret && (ret.code as string);
  };
}
