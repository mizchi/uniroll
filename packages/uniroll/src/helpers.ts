import { BaseConfigResult } from "./config/base";
import { BaseOptions } from "./config/base";
import { rollup, RollupOptions } from "rollup";
import type fs from "fs";
import { Volume } from "memfs";
import createFs, { IPromisesAPI } from "memfs/lib/promises";
import { ImportMap } from "./types";

export function createMemoryFs(files: { [k: string]: string }): IPromisesAPI {
  const vol = Volume.fromJSON(files, "/");
  return createFs(vol) as IPromisesAPI;
}

export function createUrlRewriter(opts: {
  getImportMap?: () => Promise<ImportMap | void> | ImportMap | void;
  onWarn?: (arg: any) => void;
}) {
  return async (id: string, importer: string | void = undefined) => {
    // TODO: handle npm versions
    if (importer == null) {
      return;
    }
    if (id.startsWith("http")) {
      return;
    }
    if (id.startsWith(".")) {
      return;
    }

    // handle importMap
    const importMap = await opts.getImportMap?.();
    const importMapped = importMap && importMap.imports[id];
    if (importMapped) {
      return importMapped;
    }

    // fallback to skypack
    const ret = `https://cdn.skypack.dev/${id}`;
    opts.onWarn?.(`[http-resolver]: fallback ${id} to ${ret}`);
    return ret;
  };
}

export type CompileOptions = RollupOptions &
  Omit<BaseOptions, "fs"> & {
    files: { [k: string]: string };
  };
export function createCompilerOptionBuilder(
  configBuilder: (opts: BaseOptions) => BaseConfigResult
) {
  return async function (opts: CompileOptions) {
    const memfs = createMemoryFs(opts.files);
    const importMap: ImportMap | undefined = opts.importMapPath
      ? JSON.parse((await memfs.readFile(opts.importMapPath)).toString())
      : undefined;
    const { plugins } = configBuilder({
      fs: memfs,
      importMap,
      ...opts,
    });
    return {
      ...opts,
      plugins: [...(opts.plugins ?? []), ...plugins],
    };
  };
}

export function createCompiler(
  getConfig: (opts: BaseOptions) => BaseConfigResult
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
