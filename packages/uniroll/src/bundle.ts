import { virtualFs } from "rollup-plugin-virtual-fs";
import { httpResolve } from "rollup-plugin-http-resolve";
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

export function getBundlePlugins({
  files,
  cache = defaultCache,
  define = defaultDefine,
  resolveIdFallback = defaultResolveIdFallback,
  compilerOptions = {},
  extraPlugins = [],
  useVirtualFs = true,
  useNativeFs = false,
}: Omit<CompileOptions, "input" | "rollupOptions">) {
  return [
    ...extraPlugins,
    json(),
    replace({ ...define }),
    workerPlugin(),
    httpResolve({
      cache,
      resolveIdFallback,
    }),
    ...(useVirtualFs ? [virtualFs({ files, memoryOnly: !useNativeFs })] : []),
    transform({
      resolveIdFallback,
      compilerOptions: {
        ...defaultCompilerOptions,
        ...compilerOptions,
      },
    }),
  ];
}

export function bundle(options: CompileOptions) {
  return rollup({
    input: options.input,
    plugins: getBundlePlugins(options),
    ...options.rollupOptions,
  });
}
