import { createCompiler, createMemoryFs } from "./helpers";
import { getBaseConfig } from "./config/base";
export const compile = createCompiler(getBaseConfig);
export { createMemoryFs, getBaseConfig };
