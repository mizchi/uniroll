import { getMinimalConfig, MinimalOptions } from "./minimal";
import { createTransformScript } from "../transform/createScriptTransfomer";
import { Plugin } from "rollup";

export type UnirollOptions = MinimalOptions & {
  tsconfig?: object | string;
};

export type UnirollConfigBuilderResult = {
  transformScript: (code: string, id: string) => Promise<{ code: string }>;
  plugins: Plugin[];
};

export function getBaseConfig(
  opts: UnirollOptions
): UnirollConfigBuilderResult {
  const transform = createTransformScript({ tsconfig: opts.tsconfig });
  const scriptPlugin: any = {
    name: "uniroll-script-transform",
    transform,
  };
  const config = getMinimalConfig(opts);
  return {
    transformScript: transform,
    plugins: [...config.plugins, scriptPlugin],
  };
}
