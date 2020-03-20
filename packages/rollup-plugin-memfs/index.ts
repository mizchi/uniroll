import type { Plugin } from "rollup";
import type { IPromisesAPI } from "memfs/lib/promises";
import path from "path";

export type ResolverOptions = {
  extensions?: string[];
  searchDirectoryIndex?: boolean;
  searchDirectoryPackage?: boolean;
}

const DEFALUT_EXTENSIONS = [".ts", ".tsx", ".js", ".mjs", ".json"];
export const memfsPlugin = (fs: IPromisesAPI) => {
  const resolver = new Resolver(fs);
  return {
    name: "memfs",
    async resolveId(source: string, importer: string | undefined) {
      // console.log("[memfs.resolveId]", source, importer);

      // resolve relative path;
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
      const m = await fs.readFile(id, "utf-8");
      return m;
    }
  } as Plugin;
};

class Resolver {
  private extensions: string[];
  private searchDirectoryIndex: boolean;
  private searchDirectoryPackage: boolean;
  constructor(
    private fs: IPromisesAPI,
    {
      extensions = DEFALUT_EXTENSIONS,
      searchDirectoryIndex = true,
      searchDirectoryPackage = false
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
    return this.fs.access(id).then(() => true).catch(_err => false);
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
      if ((await this.exists(pkgPath))) {
        return;
      }
      const pkgStr = await this.fs.readFile(pkgPath);
      let json;
      try {
        json = JSON.parse(pkgStr.toString());
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
