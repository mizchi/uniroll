import { UnirollVue } from "./plugins/vue-plugin";
import { getConfigWithVue } from "./config/configWithVue";
import { createCompiler } from "uniroll";

const compile = createCompiler(getConfigWithVue);

export {
  UnirollVue,
  compile
};
