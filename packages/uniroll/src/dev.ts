import { createCompiler, createMemoryFs } from "./helpers";
import { dev } from "./config/devConfig";
export const compile = createCompiler(dev);
export { createMemoryFs };
