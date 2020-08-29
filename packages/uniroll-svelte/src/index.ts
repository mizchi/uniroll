import { getConfigWithSvelte } from "./config/configWithSvelte";
import { createCompiler } from "uniroll";

export const compile = createCompiler(getConfigWithSvelte);
