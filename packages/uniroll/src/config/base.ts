import { getMinimalConfig, MinimalOptions } from "./minimal";
import { createTransformScript } from "../transform/createScriptTransfomer";
import { Plugin } from "rollup";

export type UnirollOptions<CustomOptions = {}> = MinimalOptions & {
  tsconfig?: object | string;
} & { [key in keyof CustomOptions]: CustomOptions[key] };

export type UnirollConfigBuilderResult = {
  transformScript: (code: string, id: string) => Promise<{ code: string }>;
  transformStyle?: (code: string, id: string) => Promise<{ code: string }>;
  plugins: Plugin[];
};

export function getBaseConfig(
  opts: UnirollOptions
): UnirollConfigBuilderResult {
  const transformScript = createTransformScript({ tsconfig: opts.tsconfig });
  const scriptPlugin: any = {
    name: "uniroll-script-transform",
    transform: transformScript,
  };
  const config = getMinimalConfig(opts);
  return {
    transformScript,
    // transformStyle,
    plugins: [...config.plugins, scriptPlugin],
  };
}
