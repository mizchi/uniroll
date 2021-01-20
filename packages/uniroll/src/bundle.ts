import { virtualFs } from "rollup-plugin-virtual-fs";
import { httpResolve, ResolveIdFallback } from "rollup-plugin-http-resolve";
import replace from "@rollup/plugin-replace";
import workerPlugin from "./plugins/worker-plugin";
import {
  defaultCache,
  defaultCompilerOptions,
  defaultDefine,
  defaultResolveIdFallback,
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
  resolveIdFallback = defaultResolveIdFallback,
  compilerOptions = {},
  extraPlugins = [],
  rollupOptions,
}: CompileOptions) {
  return rollup({
    input,
    plugins: [
      replace({ ...define }),
      workerPlugin(),
      httpResolve({
        cache,
        resolveIdFallback,
      }),
      virtualFs({ files }),
      transform({
        resolveIdFallback,
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
