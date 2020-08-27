import { memfsPlugin, FS } from "rollup-plugin-memfs";
import { httpResolve } from "rollup-plugin-http-resolve";
import replace, { RollupReplaceOptions } from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import omt from "../plugins/omt";

export type BaseOptions = {
  fs: FS;
  cache?: Map<string, string> | any;
  define?: RollupReplaceOptions;
  onWarn?: (...args: any) => void;
};

const defaultReplace: RollupReplaceOptions = {
  "process.env.NODE_ENV": "development",
  delimiters: ["", ""],
};

const defaultCache = new Map();

export function baseConfigBuilder({
  fs,
  cache = defaultCache,
  define = {},
  onWarn = () => {},
}: BaseOptions) {
  return {
    plugins: [
      replace({ ...defaultReplace, ...define }),
      omt(),
      json(),
      httpResolve({ cache }),
      memfsPlugin(fs),
    ],
  };
}
