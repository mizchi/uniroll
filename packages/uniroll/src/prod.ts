import { Options } from "../index.d";

import { createTransformer } from "./baseTranform";
import { pikaCDNResolver } from "rollup-plugin-pika-cdn-resolver";
import { css } from "rollup-plugin-uniroll-css";
// import { terser } from "rollup-plugin-terser";

import { transformImportPathToPikaCDN } from "babel-plugin-transform-import-to-pika-cdn";
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

import { baseline } from "./baseline";

// @ts-ignore
import precss from "precss";
import postcss from "postcss";
import autoprefixer from "autoprefixer";

export async function compile(
  options: Options & { cssPostprocess: (t: string) => string }
) {
  const babelOptions = {
    plugins: [
      classProperties,
      objectRestSpread,
      nullishCoalescing,
      transformImportPathToPikaCDN(options.versions || {}, warning => {
        console.warn(warning);
      })
    ],
    presets: [[env, { modules: false, bugfixes: true }], react, ts]
  };

  const baseTransformPlugin = {
    name: "base-transform",
    transform: createTransformer(babelOptions)
  };
  return baseline({
    ...options,
    rollupPlugins: [
      css({ postprocess: transformWithAutoprefixer }),
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
      // terser()
    ]
  });
}

async function transformWithAutoprefixer(input: string) {
  const result = await postcss([
    precss,
    autoprefixer({
      // @ts-ignore
      grid: true,
      overrideBrowserslist: ["last 2 versions", "ie 11"]
    })
  ]).process("/* autoprefixer grid: autoplace */\n" + input, {
    from: undefined
  });
  return result.css;
}
