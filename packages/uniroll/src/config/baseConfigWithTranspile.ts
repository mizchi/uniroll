import { baseConfigBuilder } from "./baseConfig";
import { createScriptTransformer } from "uniroll-transformer/src/createTransformer";
import { WithTranspileOptions } from "../types";

export function baseConfigBuilderWithTranspile(opts: WithTranspileOptions) {
  const transform = createScriptTransformer({
    babel: opts.babel,
    resolver: opts.resolver,
  });
  const scriptPlugin = {
    name: "script-transform",
    transform,
  };
  const config = baseConfigBuilder(opts);
  return {
    scriptTransform: transform,
    plugins: [...config.plugins, scriptPlugin],
  };
}
