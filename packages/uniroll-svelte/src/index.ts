import { getConfigWithSvelte } from "./config/configWithSvelte";
import { createCompiler } from "uniroll/src/helpers";

export const compile = createCompiler(getConfigWithSvelte);
