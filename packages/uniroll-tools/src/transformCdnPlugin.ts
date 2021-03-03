import ts from "typescript";
import type { Plugin } from "rollup";

export const transformCdnPlugin = (target: ts.ScriptTarget) => {
  return {
    name: "uniroll-transform-cdn",
    transform(code, id) {
      if (id.startsWith("https://") || id.startsWith("svelte")) {
        const out = ts.transpileModule(code, {
          compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target,
          },
        });
        return {
          code: out.outputText,
          map: out.sourceMapText,
        };
      }
    },
  } as Plugin;
};
