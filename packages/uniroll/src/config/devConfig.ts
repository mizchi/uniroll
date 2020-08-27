import { WithTranspileOptions, WithTranspileResult } from "../types";
import { createScriptTransformer } from "uniroll-transformer/src/createTransformer";
import { baseConfigBuilderWithTranspile } from "./baseConfigWithTranspile";

export function devConfigBuilder(
  opts: WithTranspileOptions
): WithTranspileResult {
  const transform = createScriptTransformer({
    resolver: opts.resolver,
  });
  const scriptPlugin: any = {
    name: "script-transform",
    transform,
  };
  const config = baseConfigBuilderWithTranspile(opts);
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
