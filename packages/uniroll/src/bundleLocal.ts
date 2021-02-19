import { virtualFs } from "rollup-plugin-virtual-fs";
import replace from "@rollup/plugin-replace";
import workerPlugin from "./plugins/worker-plugin";
import {
  defaultCompilerOptions,
  defaultDefine,
  defaultExtractExternal,
  defaultResolveIdFallback,
  extractImportSpecfiers,
  transform,
} from "./shared";
import { rollup } from "rollup";
import json from "@rollup/plugin-json";
import { CompileOptions } from "./types";

export function bundleLocal({
  input,
  files,
  define = defaultDefine,
  compilerOptions = defaultCompilerOptions,
  extraPlugins = [],
  rollupOptions,
  resolveIdFallback = defaultResolveIdFallback,
  extractExternal = defaultExtractExternal,
}: CompileOptions & {
  extractExternal?: (specifiers: string[]) => string[];
}) {
  const spcefiers = extractImportSpecfiers(Object.values(files));
  const external = extractExternal(spcefiers);
  return rollup({
    input,
    external,
    plugins: [
      ...extraPlugins,
      json(),
      replace({ ...defaultDefine, ...define }),
      workerPlugin(),
      virtualFs({ files }),
      transform({
        resolveIdFallback,
        compilerOptions,
      }),
    ],
    ...rollupOptions,
  });
}
