import type fs from "fs";
import { Volume } from "memfs";
import createFs, { IPromisesAPI } from "memfs/lib/promises";

export function createMemoryFs(files: { [k: string]: string }): IPromisesAPI {
  const vol = Volume.fromJSON(files, "/");
  return createFs(vol) as IPromisesAPI;
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
