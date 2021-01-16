import { virtualFs } from "rollup-plugin-virtual-fs";
import replace from "@rollup/plugin-replace";
import workerPlugin from "./plugins/worker-plugin";
import {
  defaultCompilerOptions,
  defaultDefine,
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
  cdnPrefix = "https://esm.sh/",
}: CompileOptions) {
  const external = extractImportSpecfiers(Object.values(files))
    .filter((ex) => !ex.startsWith("."))
    .map((p) => `https://esm.sh/${p}`);
  return rollup({
    input,
    external,
    plugins: [
      replace({ ...defaultDefine, ...define }),
      workerPlugin(),
      virtualFs({ files }),
      transform({
        cdnPrefix,
        compilerOptions,
      }),
      json(),
      ...extraPlugins,
    ],
    ...rollupOptions,
  });
}
