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
  importmaps: importmaps_,
  importMapsPath,
}: // importMap,
MinimalOptions) {
  const fallback = createFallback({
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
        // @ts-ignore
        fallback,
      }),
      memfsPlugin(fs),
    ],
  };
}
