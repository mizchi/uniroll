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
    tsconfig,
    ...others
  } = fullOpts;
  return others;
}

type CustomOptionsType<T> = Omit<T, keyof UnirollOptions>;

export function createCompilerOptionBuilder<ExtendableUnirollOptions extends UnirollOptions>(
  configBuilder: (opts: ExtendableUnirollOptions) => UnirollConfigBuilderResult
) {
  return async function (opts: CompileOptions & CustomOptionsType<Parameters<typeof configBuilder>[0]>) {
    const memfs = createMemoryFs(opts.files);
    const { plugins } = configBuilder({
      fs: memfs,
      ...opts,
    } as ExtendableUnirollOptions);
    return {
      ...opts,
      plugins: [...(opts.plugins ?? []), ...plugins],
    };
  };
}

export function createCompiler<ExtendableUnirollOptions extends UnirollOptions<CustomeOptions>, CustomeOptions = {}>(
  getConfig: (opts: ExtendableUnirollOptions) => UnirollConfigBuilderResult
) {
  const buildConfig = createCompilerOptionBuilder(getConfig)
  return async function (opts: CompileOptions & CustomOptionsType<Parameters<typeof getConfig>[0]>) {
    const config = await buildConfig(opts);
    const rawConfig = getRawRollupOptions(config as any);
    return rollup(rawConfig);
  };
}
