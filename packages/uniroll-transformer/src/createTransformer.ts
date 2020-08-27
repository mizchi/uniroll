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
import { transformImportPathToSkypackCDN } from "babel-plugin-transform-import-to-skypack-cdn";
// @ts-ignore
import transformPathToImportMap from "babel-plugin-transform-path-to-import-map";

export type ResolverConfig = {
  importMap?: { imports: { [key: string]: string } };
  npmVersions?: { [key: string]: string };
  onWarn?: (arg: any) => void;
};

export type UnirollTransformOptions = {
  resolver?: ResolverConfig;
  babel?: (opts: TransformOptions) => TransformOptions;
};

const getDefaultConfig = ({
  importMap = { imports: {} },
  npmVersions = {},
  onWarn,
}: ResolverConfig) => {
  return {
    plugins: [
      classProperties,
      objectRestSpread,
      nullishCoalescing,
      transformPathToImportMap(importMap ?? { imports: {} }),
      transformImportPathToSkypackCDN(npmVersions ?? {}, (warning) => {
        onWarn?.(warning);
      }),
    ],
    presets: [react, ts],
  };
};

export const createScriptTransformer = ({
  babel = (opts) => opts,
  resolver = {},
}: UnirollTransformOptions) => {
  const babelConfig = getDefaultConfig(resolver);
  const newConfig = babel?.(babelConfig);
  return async (code: string, filename: string): Promise<{ code: string }> => {
    const ret = transformBabel(code, { filename, ...newConfig });
    return { code: ret?.code as string };
  };
};
