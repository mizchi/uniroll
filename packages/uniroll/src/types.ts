import type { FS } from "rollup-plugin-memfs";
import type { RollupOptions } from "rollup";
import type { RollupReplaceOptions } from "@rollup/plugin-replace";
import type { ResolverConfig } from "uniroll-transformer/src/createTransformer";
import type { TransformOptions } from "@babel/core";

export type BaseOptions = {
  fs: FS;
  cache?: Map<string, string> | any;
  define?: RollupReplaceOptions;
  onWarn?: (...args: any) => void;
};

export type WithTranspileOptions = BaseOptions & {
  resolver?: ResolverConfig;
  babel?: (opts: TransformOptions) => TransformOptions;
};

export type WithTranspileResult = {
  scriptTransform: (code: string, id: string) => Promise<{ code: string }>;
  plugins: Plugin[];
};

export type CompileOptions = RollupOptions &
  Omit<WithTranspileOptions, "fs"> & {
    files: { [k: string]: string };
    importMapPath?: string;
  };
