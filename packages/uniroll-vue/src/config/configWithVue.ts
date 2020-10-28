import { getBaseConfig } from "uniroll";
import RollupVue from "rollup-plugin-vue";
import { UnirollVue } from "../plugins/vue-plugin";
import type { UnirollOptions, UnirollConfigBuilderResult } from "uniroll";
import type { Options } from "rollup-plugin-vue";

export type RollupVueOptions = Partial<Options>;
export type UnirollVueOptions = UnirollOptions & RollupVueOptions;

export const getConfigWithVue = (
  opts: UnirollOptions<RollupVueOptions>
): UnirollConfigBuilderResult => {
  const { transformScript, transformStyle, plugins } = getBaseConfig(opts);
  return {
    transformScript,
    transformStyle,
    plugins: [
      RollupVue(opts),
      UnirollVue(),
      ...plugins
    ],
  };
};
