import { RollupBuild, Plugin } from "rollup";

export type Cache = {
  get(key: string): Promise<string>;
  set(key: string, content: string): Promise<void>;
  clear(): Promise<void>;
};

export type BaseOptions = {
  cache?: Cache;
  rollupPlugins?: Plugin[];
  versions?: { [library: string]: string };
};

export type InMemoryOption = BaseOptions & {
  useInMemory: true;
  input: string;
  files: { [k: string]: string };
};

export type LocalOptions = BaseOptions & {
  useInMemory: false;
  input: string;
  cwd: string;
  fs: any;
};

export type Options = InMemoryOption | LocalOptions;

export function compile(options: Options): Promise<RollupBuild>;
