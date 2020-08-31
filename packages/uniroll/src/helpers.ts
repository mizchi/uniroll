import { ImportMaps } from "rollup-plugin-http-resolve";
import { UnirollConfigBuilderResult } from "./config/base";
import { UnirollOptions } from "./config/base";
import { rollup, RollupOptions } from "rollup";
import type fs from "fs";
import { Volume } from "memfs";
import createFs, { IPromisesAPI } from "memfs/lib/promises";
// import { ImportMap } from "./types";

export function createMemoryFs(files: { [k: string]: string }): IPromisesAPI {
  const vol = Volume.fromJSON(files, "/");
  return createFs(vol) as IPromisesAPI;
}

export type CompileOptions = RollupOptions &
  Omit<UnirollOptions, "fs"> & {
    files: { [k: string]: string };
  };
export function createCompilerOptionBuilder(
  configBuilder: (opts: UnirollOptions) => UnirollConfigBuilderResult
) {
  return async function (opts: CompileOptions) {
    const memfs = createMemoryFs(opts.files);
    const importmaps: ImportMaps | undefined = opts.importMapsPath
      ? JSON.parse((await memfs.readFile(opts.importMapsPath)).toString())
      : undefined;
    const { plugins } = configBuilder({
      fs: memfs,
      importmaps,
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
    return rollup(config);
  };
}

export async function readPkgVersionsIfExists(
  fs_: typeof fs.promises,
  pkgPath: string
): Promise<{ [key: string]: string } | null> {
  try {
    const pkgStr = await fs_.readFile(pkgPath, "utf-8");
    const pkg = JSON.parse(pkgStr);
    return { ...pkg?.dependencies };
  } catch (err) {
    return null;
  }
}

export async function readImportMapIfExists(
  fs_: typeof fs.promises,
  importMapPath: string
): Promise<{ imports: { [key: string]: string } } | null> {
  try {
    const importMapStr = await fs_.readFile(importMapPath, "utf-8");
    return JSON.parse(importMapStr);
  } catch (err) {
    return null;
  }
}
