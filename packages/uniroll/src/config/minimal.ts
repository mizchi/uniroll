// import { FS_API } from "./../../../rollup-plugin-memfs/src/index";
// import { ImportMaps } from './../../../rollup-plugin-http-resolve/src/index';
// import type { ImportMap } from "../types";
import { memfsPlugin, FS, FS_API } from "rollup-plugin-memfs";
import {
  httpResolve,
  createFallback,
  ImportMaps,
} from "rollup-plugin-http-resolve/src/index";
import replace, { RollupReplaceOptions } from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import workerPlugin from "../plugins/worker-plugin";
// import { createUrlRewriter } from "../helpers";

export type MinimalOptions = {
  fs: FS;
  cache?: Map<string, string> | any;
  define?: RollupReplaceOptions;
  onWarn?: (...args: any) => void;
  importmaps?: ImportMaps;
  importMapsPath?: string;
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
  importmaps: importmaps_,
  importMapsPath,
}: // importMap,
MinimalOptions) {
  const fallback = createFallback({
    onWarn,
    async importmaps() {
      if (importmaps_) {
        return importmaps_;
      }
      if (importMapsPath) {
        // @ts-ignore
        const rawstr = await fs.readFile(importMapsPath, "utf-8");
        return JSON.parse(rawstr as string) as ImportMaps;
      } else {
        return {
          imports: {},
        };
      }
    },
  });
  return {
    plugins: [
      replace({ ...defaultReplace, ...define }),
      workerPlugin(),
      json(),
      httpResolve({
        cache,
        fallback,
      }),
      memfsPlugin(fs),
    ],
  };
}
