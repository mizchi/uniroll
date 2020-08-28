import { getMinimalConfig, MinimalOptions } from "./minimal";
import { createScriptTransformer } from "../transform/createScriptTransfomer";

export type BaseOptions = MinimalOptions & {
  tsconfig?: object | string;
};

export type BaseConfigResult = {
  scriptTransform: (code: string, id: string) => Promise<{ code: string }>;
  plugins: Plugin[];
};

export function getBaseConfig(opts: BaseOptions): BaseConfigResult {
  const transform = createScriptTransformer({ tsconfig: opts.tsconfig });
  const scriptPlugin: any = {
    name: "uniroll-script-transform",
    transform,
  };
  const config = getMinimalConfig(opts);
  return {
    scriptTransform: transform,
    plugins: [...config.plugins, scriptPlugin],
  };
}
