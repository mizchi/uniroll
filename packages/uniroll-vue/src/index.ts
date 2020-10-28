import { UnirollVue } from "./plugins/vue-plugin";
import RollupVue from "rollup-plugin-vue";
import { getConfigWithVue } from "./config/configWithVue";
import { createCompiler } from "uniroll";
import type { UnirollVueOptions, RollupVueOptions } from "./config/configWithVue";

const compile = createCompiler<UnirollVueOptions, RollupVueOptions>(getConfigWithVue);

export {
  RollupVue,
  RollupVueOptions,
  UnirollVue,
  UnirollVueOptions,
  getConfigWithVue,
  compile
};
