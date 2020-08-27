import type { TransformOptions } from "@babel/core";
import { base, BaseOptions } from "./base";
import {
  createScriptTransformer,
  ResolverConfig,
} from "uniroll-transformer/src/createTransformer";

export type WithTranspileOptions = BaseOptions & {
  resolver?: ResolverConfig;
  babel?: (opts: TransformOptions) => TransformOptions;
};

export function baseWithTranspile(opts: WithTranspileOptions) {
  const transform = createScriptTransformer({
    babel: opts.babel,
    resolver: opts.resolver,
  });
  const scriptPlugin = {
    name: "script-transform",
    transform,
  };
  const config = base(opts);
  return {
    scriptTransform: transform,
    plugins: [...config.plugins, scriptPlugin],
  };
}
