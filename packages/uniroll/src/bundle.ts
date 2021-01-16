import { virtualFs } from "rollup-plugin-virtual-fs";
import { httpResolve } from "rollup-plugin-http-resolve";
import replace from "@rollup/plugin-replace";
import workerPlugin from "./plugins/worker-plugin";
import {
  createImportMapsFallback,
  defaultCache,
  defaultCompilerOptions,
  defaultDefine,
  defaultImportMaps,
  transform,
} from "./shared";
import { rollup } from "rollup";
import json from "@rollup/plugin-json";
import { CompileOptions } from "./types";

export function bundle({
  input,
  files,
  cache = defaultCache,
  define = defaultDefine,
  importmaps = defaultImportMaps,
  compilerOptions = {},
  extraPlugins = [],
  cdnPrefix,
  rollupOptions,
}: CompileOptions) {
  const fallback = createImportMapsFallback({
    importmaps,
    cdnPrefix: cdnPrefix,
  });
  return rollup({
    input,
    plugins: [
      replace({ ...define }),
      workerPlugin(),
      httpResolve({
        cache,
        fallback,
      }),
      virtualFs({ files }),
      transform({
        cdnPrefix,
        compilerOptions: {
          ...defaultCompilerOptions,
          ...compilerOptions,
        },
      }),
      json(),
      ...extraPlugins,
    ],
    ...rollupOptions,
  });
}
