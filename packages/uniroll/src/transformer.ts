import { transform as transformBabel, TransformOptions } from "@babel/core";
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

export function createTransformer(options: TransformOptions = {}) {
  return async (code: string, id: string) => {
    const ret = transformBabel(code, {
      filename: id,
      plugins: [
        ...(options.plugins ?? []),
        classProperties,
        objectRestSpread,
        nullishCoalescing,
      ],
      presets: [...(options.presets ?? []), react, ts],
    });
    return ret && (ret.code as string);
  };
}
