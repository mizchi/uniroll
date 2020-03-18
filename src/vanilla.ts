import fs from "fs";
import path from "path";
import { rollup, Plugin, InputOptions } from "rollup";

export const fooPlugin: Plugin = {
  name: "foo",
  async resolveId(source: string, importer: string | undefined) {
    let id = source;
    if (importer) {
      const dirname = path.dirname(importer);
      id = path.resolve(dirname, source);
    }
    console.debug(`[resolveId] ${id}`);
    return {
      id,
      external: false,
      moduleSideEffects: false,
      syntheticNamedExports: true
    };
  },
  async load(id: string) {
    return fs.promises.readFile(id, "utf-8");
  },
  // resolveImportMeta: ResolveImportMetaHook;
  transform(code: string) {
    return code;
  },
  watchChange: (id: string): void => {}
};
