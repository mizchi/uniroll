import { Options } from "../index.d";
import { createTransformer } from "./baseTranform";
import { pikaCDNResolver } from "rollup-plugin-pika-cdn-resolver";
import { css } from "rollup-plugin-uniroll-css";
// @ts-ignore
import transformPathToImportMap from "babel-plugin-transform-path-to-import-map";
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
import replace from "@rollup/plugin-replace";
import {
  createMemoryFs,
  readPkgVersionsIfExists,
  readImportMapIfExists,
} from "./helpers";
import path from "path";

const defaultCache = new Map();

export async function compile(
  options: Options & { cssPostprocess: (t: string) => string }
) {
  const mfs = options.useInMemory ? createMemoryFs(options.files) : options.fs;
  const rootpath = options.useInMemory
    ? path.dirname(path.join(process.cwd(), options.input))
    : "/";
  const pkgPath = path.join(rootpath, "package.json");
  const importMapPath = path.join(rootpath, "import-map.json");

  const versions = await readPkgVersionsIfExists(mfs, pkgPath);
  const importMap = await readImportMapIfExists(mfs, importMapPath);

  const babelOptions = {
    plugins: [
      classProperties,
      objectRestSpread,
      nullishCoalescing,
      transformPathToImportMap(importMap),
      transformImportPathToPikaCDN(
        versions ?? options.versions ?? {},
        (warning) => options.onWarn?.(warning)
      ),
    ],
    presets: [[env, { modules: false, bugfixes: true }], react, ts],
  };

  const baseTransformPlugin = {
    name: "base-transform",
    transform: createTransformer(babelOptions),
  };
  return baseline({
    ...options,
    fs: mfs,
    rollupPlugins: [
      ...(options.rollupPlugins ?? []),
      replace({
        "process.env.NODE_ENV": "production",
        delimiters: ["", ""],
        ...options.replaceMap,
      }),
      css({ postprocess: transformWithAutoprefixer }),
      pikaCDNResolver({
        ignorePolyfill: true,
        cache: options.cache ?? defaultCache,
        onRequest: options.onRequest,
        onUseCache: options.onUseCache,
      }),
      baseTransformPlugin,
    ],
  });
}

async function transformWithAutoprefixer(input: string) {
  const result = await postcss([
    precss,
    autoprefixer({
      // @ts-ignore
      grid: true,
      overrideBrowserslist: ["last 2 versions", "ie 11"],
    }),
  ]).process("/* autoprefixer grid: autoplace */\n" + input, {
    from: undefined,
  });
  return result.css;
}
