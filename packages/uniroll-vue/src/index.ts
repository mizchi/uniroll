import { getConfigWithVue } from "./config/configWithVue";
import { createCompiler } from "uniroll";

export const compile = createCompiler(getConfigWithVue);
