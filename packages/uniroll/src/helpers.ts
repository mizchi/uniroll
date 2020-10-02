import { UnirollConfigBuilderResult } from "./config/base";
import { UnirollOptions } from "./config/base";
import { rollup, RollupOptions } from "rollup";
import { Volume } from "memfs";
import createFs, { IPromisesAPI } from "memfs/lib/promises";

export function createMemoryFs(files: { [k: string]: string }): IPromisesAPI {
  const vol = Volume.fromJSON(files, "/");
  return createFs(vol) as IPromisesAPI;
}

export type CompileOptions = RollupOptions &
  Omit<UnirollOptions, "fs"> & {
    files: { [k: string]: string };
  };

export function getRawRollupOptions(
  fullOpts: RollupOptions & UnirollOptions
): RollupOptions {
  const {
    fs,
    // @ts-ignore
    files,
    cache,
    define,
    importmaps,
    ...others
  } = fullOpts;
  return others;
}
export function createCompilerOptionBuilder(
  configBuilder: (opts: UnirollOptions) => UnirollConfigBuilderResult
) {
  return async function (opts: CompileOptions) {
    const memfs = createMemoryFs(opts.files);
    const { plugins } = configBuilder({
      fs: memfs,
      ...opts,
    });
    return {
      ...opts,
      plugins: [...(opts.plugins ?? []), ...plugins],
    };
  };
}

export function createCompiler(
  getConfig: (opts: UnirollOptions) => UnirollConfigBuilderResult
) {
  const buildConfig = createCompilerOptionBuilder(getConfig);
  return async function (opts: CompileOptions) {
    const config = await buildConfig(opts);
    const rawConfig = getRawRollupOptions(config as any);
    return rollup(rawConfig);
  };
}
