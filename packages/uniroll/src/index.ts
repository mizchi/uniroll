import {
  createCompiler,
  createMemoryFs,
  createCompilerOptionBuilder,
} from "./helpers";
import { getBaseConfig } from "./config/base";
export { UnirollConfigBuilderResult, UnirollOptions } from "./config/base";
export const compile = createCompiler(getBaseConfig);
export {
  createMemoryFs,
  getBaseConfig,
  createCompilerOptionBuilder,
  createCompiler,
};
