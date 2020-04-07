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
import path from "path";
import { baseline } from "./baseline";
import { createMemoryFs, readPkgVersionsIfExists } from "./helpers";
import replace from "@rollup/plugin-replace";

const defaultCache = new Map();

export async function compile(options: Options) {
  const mfs = options.useInMemory ? createMemoryFs(options.files) : options.fs;
  const rootpath = options.useInMemory
    ? path.dirname(path.join(process.cwd(), options.input))
    : "/";
  const pkgPath = path.join(rootpath, "package.json");

  const versions = await readPkgVersionsIfExists(mfs, pkgPath);

  const babelOptions = {
    plugins: [
      classProperties,
      objectRestSpread,
      nullishCoalescing,
      transformImportPathToPikaCDN(
        versions ?? options.versions ?? {},
        (warning) => {
          options.onWarn?.(warning);
        }
      ),
    ],
    presets: [react, ts],
  };

  const baseTransformPlugin = {
    name: "base-transform",
    transform: createTransformer(babelOptions),
  };

  const bundle = baseline({
    ...options,
    fs: mfs,
    rollupPlugins: [
      replace({ "process.env.NODE_ENV": "development" }),
      css(),
      pikaCDNResolver({
        cache: options.cache ?? defaultCache,
        ignorePolyfill: true,
        onRequest: options.onRequest,
        onUseCache: options.onUseCache,
      }),
      baseTransformPlugin,
    ],
  });
  return bundle;
}
