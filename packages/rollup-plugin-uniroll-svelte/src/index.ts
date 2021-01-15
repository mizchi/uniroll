import { createStylePreprocessor } from "./stylePreprocess";
import type { Plugin } from "rollup";
import { compile as svelteCompile, preprocess } from "svelte/compiler";
import { createSveltePreprocessor } from "./tsPreprocess";
import ts from "typescript";
import { CompileOptions } from "svelte/types/compiler/interfaces";

type SveltePluginOptions = {
  target: ts.ScriptTarget;
  cdnPrefix: string;
  svelteOptions?: CompileOptions;
};

export const svelte = (opts: SveltePluginOptions) => {
  const tsPreprocess = createSveltePreprocessor(opts);
  const stylePreprocess = createStylePreprocessor({});
  return {
    name: "uniroll-svelte",
    async transform(code: string, id: string) {
      if (id.endsWith(".svelte")) {
        const { code: preprocessed } = await preprocess(
          code,
          [tsPreprocess, stylePreprocess],
          {
            filename: id,
          }
        );
        const result = svelteCompile(preprocessed, opts.svelteOptions);
        if (result.warnings.length > 0) {
          this.warn(result.warnings.map((t) => t.message).join("\n"));
        }
        // return result.js;
        if (opts.target === ts.ScriptTarget.ES5) {
          const ret = ts.transpileModule(result.js.code, {
            fileName: "$$temp.tsx",
            compilerOptions: {
              target: opts.target,
              module: ts.ModuleKind.ESNext,
            },
          });
          return {
            code: ret.outputText,
            map: ret.sourceMapText,
          };
        } else {
          return result.js;
        }
      }
    },
  } as Plugin;
};
