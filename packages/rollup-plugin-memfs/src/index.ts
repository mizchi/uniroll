import type _fs from "fs";
import type { Plugin } from "rollup";
import type { IPromisesAPI } from "memfs/lib/promises";

import path from "path";

export type FS = IPromisesAPI | typeof _fs["promises"];

export type ResolverOptions = {
  extensions?: string[];
  searchDirectoryIndex?: boolean;
  searchDirectoryPackage?: boolean;
};

export type FS_API = {
  readFile(filepath: string): Promise<string>;
  exists(filepath: string): Promise<boolean>;
};

const SEARCH_EXTENSIONS = [
  "/index.tsx",
  "/index.ts",
  "/index.js",
  ".tsx",
  ".ts",
  ".json",
  ".js",
];
export function wrapFs(fs: FS) {
  const exists = async (filepath: string) => {
    return await fs
      .access(filepath)
      .then(() => true)
      .catch(() => false);
  };

  return {
    async readFile(filepath: string) {
      // search .tsx , .ts
      let target = filepath;
      if (await exists(target)) {
        // itself
      } else {
        for (const ext of SEARCH_EXTENSIONS) {
          if (await exists(filepath + ext)) {
            target = filepath + ext;
            break;
          }
        }
      }
      return (await fs.readFile(target, "utf-8")) as string;
    },
    exists,
  };
}

const DEFALUT_EXTENSIONS = [".ts", ".tsx", ".js", ".mjs", ".json"];

export const altfsPlugin = (fs: FS_API) => {
  const resolver = new Resolver(fs);
  return {
    name: "altfs",
    async resolveId(source: string, importer: string | undefined) {
      if (importer && importer.startsWith("/") && source.startsWith(".")) {
        const fullpath = importer
          ? path.resolve(path.dirname(importer), source)
          : source;
        const reslovedWithExt = await resolver.resolveId(fullpath);
        return reslovedWithExt;
      }
      return source;
    },
    async load(id: string) {
      const m = await fs.readFile(id);
      return m;
    },
  } as Plugin;
};

export const memfsPlugin = (fs: FS) => {
  const wrappedFs = wrapFs(fs);
  return altfsPlugin(wrappedFs);
};

class Resolver {
  private extensions: string[];
  private searchDirectoryIndex: boolean;
  private searchDirectoryPackage: boolean;
  constructor(
    private fs: FS_API,
    {
      extensions = DEFALUT_EXTENSIONS,
      searchDirectoryIndex = true,
      searchDirectoryPackage = false,
    }: ResolverOptions = {}
  ) {
    this.extensions = extensions;
    // always include id itself first
    if (!this.extensions.includes("")) {
      this.extensions.unshift("");
    }
    this.searchDirectoryIndex = searchDirectoryIndex;
    this.searchDirectoryPackage = searchDirectoryPackage;
  }

  async exists(id: string): Promise<boolean> {
    return this.fs.exists(id);
  }
  async resolveId(id: string): Promise<string | void> {
    // [id][ext]
    for (const ext of this.extensions) {
      const s = id + ext;
      if (await this.exists(s)) {
        return id + ext;
      }
    }

    for (const ext of this.extensions) {
      const s = path.join(id, "index" + ext);
      if (await this.exists(s)) {
        return id + ext;
      }
    }

    // [id]/index[ext]
    if (this.searchDirectoryIndex) {
      for (const ext of this.extensions) {
        const s = path.join(id, "index" + ext);
        if (await this.exists(s)) {
          return s;
        }
      }
    }
    // [id]/package.json#main
    if (this.searchDirectoryPackage) {
      const pkgPath = path.join(id, "package.json");
      if (await this.exists(pkgPath)) {
        return;
      }
      const pkgStr = await this.fs.readFile(pkgPath);
      let json;
      try {
        json = JSON.parse(pkgStr);
      } catch (err) {
        console.warn(err);
        // through parse error
      }
      if (json && json.module) {
        return json.module;
      }
      if (json && json.main) {
        return json.main;
      }
    }
  }
}
