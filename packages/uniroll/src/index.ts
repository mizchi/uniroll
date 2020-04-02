import { Options } from "../index.d";
import { createTransformer } from "./baseTranform";
import { pikaCDNResolver } from "rollup-plugin-pika-cdn-resolver";
import { css } from "rollup-plugin-uniroll-css";
import { transformImportPathToPikaCDN } from "babel-plugin-transform-import-to-pika-cdn";
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

import { baseline } from "./baseline";

export async function compile(options: Options) {
  const babelOptions = {
    plugins: [
      classProperties,
      objectRestSpread,
      nullishCoalescing,
      transformImportPathToPikaCDN(options.versions || {}, warning => {
        console.warn(warning);
      })
    ],
    presets: [react, ts]
  };

  const baseTransformPlugin = {
    name: "base-transform",
    transform: createTransformer(babelOptions)
  };

  const bundle = baseline({
    ...options,
    rollupPlugins: [
      css(),
      pikaCDNResolver({
        cache: new Map() as any,
        onRequest: id => {
          console.log("[pika-resolver] onRequest", id);
        },
        onUseCache: id => {
          console.log("[pika-resolver] onUseCache", id);
        }
      }),
      baseTransformPlugin
    ]
  });
  return bundle;
}
