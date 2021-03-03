import { ResolveIdFallback } from "rollup-plugin-http-resolve";
import { RollupReplaceOptions } from "@rollup/plugin-replace";
import { RollupOptions, Plugin } from "rollup";
import ts from "typescript";

export type ImportMaps = {
  imports: { [k: string]: string };
};

export type Cache = {
  get(key: string): Promise<string>;
  set(key: string, content: string): Promise<void>;
  clear(): Promise<void>;
};

export type CompileOptions = {
  input: string;
  files: { [k: string]: string };
  rollupOptions?: Partial<Omit<RollupOptions, "plugins" | "input">>;
  compilerOptions?: Partial<ts.CompilerOptions>;
  resolveIdFallback?: ResolveIdFallback;
  cache?: Map<string, string> | any;
  extraPlugins?: Plugin[];
  useVirtualFs?: boolean;
  useNativeFs?: boolean;
};
