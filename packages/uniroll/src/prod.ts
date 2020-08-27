import { createCompiler, createMemoryFs } from "./helpers";
import { prod } from "./config/prodConfig";
export const compile = createCompiler(prod);
export { createMemoryFs };
