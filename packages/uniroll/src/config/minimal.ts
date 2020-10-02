import { memfsPlugin, FS } from "rollup-plugin-memfs";
import {
  httpResolve,
  createFallback,
  ImportMaps,
} from "rollup-plugin-http-resolve";
import replace, { RollupReplaceOptions } from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import workerPlugin from "../plugins/worker-plugin";

export type MinimalOptions = {
  fs: FS;
  cache?: Map<string, string> | any;
  define?: RollupReplaceOptions;
  importmaps?: ImportMaps;
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
  importmaps = { imports: {} },
}: MinimalOptions) {
  const fallback = createFallback({
    importmaps,
  });
  return {
    plugins: [
      replace({ ...defaultReplace, ...define }),
      workerPlugin(),
      json(),
      httpResolve({
        cache,
        // @ts-ignore
        fallback,
      }),
      memfsPlugin(fs),
    ],
  };
}
