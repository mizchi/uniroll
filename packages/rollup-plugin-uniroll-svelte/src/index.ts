import { PreprocessorGroup } from "svelte/types/compiler/preprocess";
import type { Plugin } from "rollup";
import { compile as svelteCompile, preprocess } from "svelte/compiler";
import {
  cdnRewriteTransformerFactory,
  createSveltePreprocessor,
} from "./tsPreprocess";
import ts from "typescript";
import { CompileOptions } from "svelte/types/compiler/interfaces";
import { ResolveIdFallback } from "./types";

type SveltePluginOptions = {
  target: ts.ScriptTarget;
  resolveIdFallback?: ResolveIdFallback;
  svelteOptions?: CompileOptions;
  extraPreprocess?: PreprocessorGroup[];
};

const defaultResolveIdFallback: ResolveIdFallback = (
  id: string,
  importer?: string
) => {
  return;
};

export const svelte = (opts: SveltePluginOptions) => {
  /**
   * if css is set to false, then output css file instead of js injection.
   */
  const willOutptuCss = !opts.svelteOptions?.css;
  const cssFiles = new Map<string, any>();

  return {
    name: "uniroll-svelte",
    buildStart() {
      cssFiles.clear();
    },
    load(id: string) {
      if (!cssFiles.has(id)) return;
      return cssFiles.get(id);
    },
    async transform(code: string, id: string) {
      if (id.endsWith(".svelte")) {
        const tsPreprocess = createSveltePreprocessor({
          target: opts.target,
          importer: id,
          resolveIdFallback: opts.resolveIdFallback ?? defaultResolveIdFallback,
        });

        const { code: preprocessed } = await preprocess(
          code,
          [tsPreprocess, ...(opts.extraPreprocess ?? ([] as any))],
          {
            filename: id,
          }
        );
        const result = svelteCompile(preprocessed, opts.svelteOptions);
        if (result.warnings.length > 0) {
          this.warn(result.warnings.map((t) => t.message).join("\n"));
        }

        if (willOutptuCss && result.css.code) {
          const cssFileName = `/svelte-generated-css/${Math.random().toString(16)}.css`;
          result.js.code += `\nimport "${cssFileName}";\n`;
          cssFiles.set(cssFileName, result.css);
        }

        const ret = ts.transpileModule(result.js.code, {
          fileName: "$temp.tsx",
          compilerOptions: {
            target: opts.target,
            module: ts.ModuleKind.ESNext,
          },
          transformers: {
            before: [cdnRewriteTransformerFactory(opts.resolveIdFallback!, id)],
          },
        });

        return {
          code: ret.outputText,
          map: ret.sourceMapText,
        };
      }
    },
  } as Plugin;
};
