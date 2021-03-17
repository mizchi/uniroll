import { PreprocessorGroup } from "svelte/types/compiler/preprocess";
import type { EmittedAsset, Plugin } from "rollup";
import { compile as svelteCompile, preprocess } from "svelte/compiler";
import {
  cdnRewriteTransformerFactory,
  createSveltePreprocessor,
} from "./tsPreprocess";
import ts from "typescript";
import { CompileOptions } from "svelte/types/compiler/interfaces";
import { defaultResolveIdFallback } from "uniroll";
import { ResolveIdFallback } from "./types";

type SveltePluginOptions = {
  target?: ts.ScriptTarget;
  resolveIdFallback?: ResolveIdFallback;
  svelteOptions?: CompileOptions;
  extraPreprocess?: PreprocessorGroup[];
  emitCss?: boolean;
};

export const svelte = ({
  target = ts.ScriptTarget.ES2019,
  resolveIdFallback = defaultResolveIdFallback,
  extraPreprocess = [],
  emitCss = false,
  svelteOptions = {},
}: SveltePluginOptions = {}) => {
  return {
    name: "uniroll-svelte",
    async transform(code: string, id: string) {
      if (id.endsWith(".svelte")) {
        const tsPreprocess = createSveltePreprocessor({
          target,
          importer: id,
          resolveIdFallback: resolveIdFallback ?? defaultResolveIdFallback,
        });
        const { code: preprocessed } = await preprocess(
          code,
          [tsPreprocess, ...extraPreprocess],
          {
            filename: id,
          }
        );
        const result = svelteCompile(preprocessed, svelteOptions);
        result.warnings.forEach(warning => {
          const start = warning.start;
          if (start !== undefined) {
            const line = start.line;
            const column = start.column;
            this.warn(warning.message + " (" + line + ":" + column + ")");
          } else {
            this.warn(warning.message);
          }
        });

        if (emitCss && result.css.code) {
          const hash = Math.random().toString(32).substring(2);
          this.emitFile({
            type: "asset",
            source: result.css.code,
            fileName: `uniroll-svelte-${hash}.css`,
          } as EmittedAsset);
        }

        const tsCompiled = ts.transpileModule(result.js.code, {
          fileName: "$temp.tsx",
          compilerOptions: {
            target: target,
            module: ts.ModuleKind.ESNext,
          },
          transformers: {
            before: [cdnRewriteTransformerFactory(resolveIdFallback, id)],
          },
        });

        return {
          code: tsCompiled.outputText,
          map: tsCompiled.sourceMapText,
        };
      }
    },
  } as Plugin;
};
