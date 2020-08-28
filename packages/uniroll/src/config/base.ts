import { getMinimalConfig, MinimalOptions } from "./minimal";
import { createtransformScripter } from "../transform/createScriptTransfomer";

export type BaseOptions = MinimalOptions & {
  tsconfig?: object | string;
};

export type BaseConfigResult = {
  transformScript: (code: string, id: string) => Promise<{ code: string }>;
  plugins: Plugin[];
};

export function getBaseConfig(opts: BaseOptions): BaseConfigResult {
  const transform = createtransformScripter({ tsconfig: opts.tsconfig });
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
