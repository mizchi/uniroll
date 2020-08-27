import { createScriptTransformer } from "uniroll-transformer/src/createTransformer";
import { baseWithTranspile, WithTranspileOptions } from "./baseWithTranspile";

export function dev(opts: WithTranspileOptions) {
  const transform = createScriptTransformer({
    resolver: opts.resolver,
  });
  const scriptPlugin = {
    name: "script-transform",
    transform,
  };
  const config = baseWithTranspile(opts);
  return {
    scriptTransform: transform,
    plugins: [...config.plugins, scriptPlugin],
  };
}
// const rootpath = options.useInMemory ? "/" : "/";
// const pkgPath = path.join(rootpath, "package.json");
// const importMapPath = path.join(rootpath, "import-map.json");
// const npmVersions = await readPkgVersionsIfExists(memfs, pkgPath);
// const importMap = await readImportMapIfExists(memfs, importMapPath);
