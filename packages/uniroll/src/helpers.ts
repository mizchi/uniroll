import { rollup } from "rollup";
import type fs from "fs";
import { Volume } from "memfs";
import createFs, { IPromisesAPI } from "memfs/lib/promises";
import {
  CompileOptions,
  WithTranspileOptions,
  WithTranspileResult,
} from "./types";

export function createMemoryFs(files: { [k: string]: string }): IPromisesAPI {
  const vol = Volume.fromJSON(files, "/");
  return createFs(vol) as IPromisesAPI;
}

export function createCompilerOptionBuilder(
  configBuilder: (opts: WithTranspileOptions) => WithTranspileResult
) {
  return async function (opts: CompileOptions) {
    const memfs = createMemoryFs(opts.files);
    const importMap = opts.importMapPath
      ? JSON.parse((await memfs.readFile(opts.importMapPath)).toString())
      : undefined;
    const { plugins } = configBuilder({
      fs: memfs,
      resolver: {
        importMap,
      },
      ...opts,
    });
    return {
      ...opts,
      plugins: [...(opts.plugins ?? []), ...plugins],
    };
  };
}

export function createCompiler(
  configBuilder: (opts: WithTranspileOptions) => WithTranspileResult
) {
  const buildConfig = createCompilerOptionBuilder(configBuilder);
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
