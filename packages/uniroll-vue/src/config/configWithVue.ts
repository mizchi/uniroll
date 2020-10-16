import { UnirollVue } from "../plugins/vue-plugin";
import RollupVue from "rollup-plugin-vue";
import {
  getBaseConfig,
  UnirollOptions,
  UnirollConfigBuilderResult,
} from "uniroll";

export const getConfigWithVue = (
  opts: UnirollOptions
): UnirollConfigBuilderResult => {
  const { transformScript, transformStyle, plugins } = getBaseConfig(opts);
  return {
    transformScript,
    transformStyle,
    plugins: [
      RollupVue(),
      UnirollVue(),
      ...plugins
    ],
  };
};
