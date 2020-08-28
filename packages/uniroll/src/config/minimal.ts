import type { ImportMap } from "../types";
import { memfsPlugin, FS } from "rollup-plugin-memfs";
import { httpResolve } from "rollup-plugin-http-resolve/src/index";
import replace, { RollupReplaceOptions } from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import workerPlugin from "../plugins/worker-plugin";
import { createUrlRewriter } from "../helpers";

export type MinimalOptions = {
  fs: FS;
  cache?: Map<string, string> | any;
  define?: RollupReplaceOptions;
  onWarn?: (...args: any) => void;
  importMapPath?: string;
  importMap?: ImportMap;
};

const defaultReplace: RollupReplaceOptions = {
  "process.env.NODE_ENV": "development",
  delimiters: ["", ""],
};

const defaultCache = new Map();

export function getMinimalConfig({
  fs,
  cache = defaultCache,
  define = {},
  onWarn = () => {},
  importMapPath,
  importMap,
}: MinimalOptions) {
  const rewriter = createUrlRewriter({
    onWarn,
    async getImportMap() {
      if (importMap) {
        return importMap;
      }
      if (importMapPath == null) {
        return;
      }
      const rawstr = await fs.readFile(importMapPath, "utf-8");
      return JSON.parse(rawstr as string) as ImportMap;
    },
  });
  return {
    plugins: [
      replace({ ...defaultReplace, ...define }),
      workerPlugin(),
      json(),
      httpResolve({
        cache,
        rewriter,
      }),
      memfsPlugin(fs),
    ],
  };
}
