import { virtualFs } from "rollup-plugin-virtual-fs";
import replace from "@rollup/plugin-replace";
import workerPlugin from "./plugins/worker-plugin";
import {
  defaultCompilerOptions,
  defaultExtractExternal,
  defaultResolveIdFallback,
  extractImportSpecfiers,
  transform,
} from "./shared";
import { rollup } from "rollup";
import json from "@rollup/plugin-json";
import { CompileOptions } from "./types";

type BundleLocalOptions = CompileOptions & {
  extractExternal?: (specifiers: string[]) => string[];
};

export function getBundleLocalPlugins({
  files,
  compilerOptions = defaultCompilerOptions,
  extraPlugins = [],
  useVirtualFs = true,
  useNativeFs = false,
  resolveIdFallback = defaultResolveIdFallback,
}: Omit<BundleLocalOptions, "rollupOptions" | "input" | "extractExternal">) {
  return [
    ...extraPlugins,
    json(),
    workerPlugin(),
    ...(useVirtualFs ? [virtualFs({ files, memoryOnly: !useNativeFs })] : []),
    transform({
      resolveIdFallback,
      compilerOptions,
    }),
  ];
}

export function bundleLocal(options: BundleLocalOptions) {
  const spcefiers = extractImportSpecfiers(Object.values(options.files));
  const extractExternal = options.extractExternal ?? defaultExtractExternal;
  const external = extractExternal(spcefiers);
  return rollup({
    input: options.input,
    external,
    plugins: getBundleLocalPlugins(options),
    ...options.rollupOptions,
  });
}
