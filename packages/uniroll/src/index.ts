import { Options } from "../index.d";
import { createTransformer } from "./transformer";
import { httpResolve } from "rollup-plugin-http-resolve";
import { css } from "rollup-plugin-uniroll-css";
import { transformImportPathToSkypackCDN } from "babel-plugin-transform-import-to-skypack-cdn";
// @ts-ignore
import transformPathToImportMap from "babel-plugin-transform-path-to-import-map";
import path from "path";
import { baseline } from "./baseline";
import {
  createMemoryFs,
  readPkgVersionsIfExists,
  readImportMapIfExists,
} from "./helpers";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";

const defaultCache = new Map();

export async function compile(options: Options) {
  const mfs = options.useInMemory ? createMemoryFs(options.files) : options.fs;

  // TODO: Fix me
  const rootpath = options.useInMemory ? "/" : "/";

  const pkgPath = path.join(rootpath, "package.json");
  const importMapPath = path.join(rootpath, "import-map.json");

  const versions = await readPkgVersionsIfExists(mfs, pkgPath);
  const importMap = await readImportMapIfExists(mfs, importMapPath);

  const babelOptions = {
    plugins: [
      transformPathToImportMap(importMap ?? { imports: {} }),
      transformImportPathToSkypackCDN(
        versions ?? options.versions ?? {},
        (warning) => {
          options.onWarn?.(warning);
        }
      ),
    ],
    presets: [],
  };

  const baseTransformPlugin = {
    name: "base-transform",
    transform: createTransformer(babelOptions),
  };

  const bundle = baseline({
    ...options,
    fs: mfs,
    rollupPlugins: [
      ...(options.rollupPlugins ?? []),
      replace({ "process.env.NODE_ENV": "development", ...options.replaceMap }),
      json(),
      css(),
      httpResolve({
        cache: options.cache ?? defaultCache,
        onRequest: options.onRequest,
        onUseCache: options.onUseCache,
      }),
      baseTransformPlugin,
    ],
  });
  return bundle;
}
