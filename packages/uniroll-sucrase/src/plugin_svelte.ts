import type { EmittedAsset, Plugin } from "rollup";
import type { CompileOptions } from "svelte/types/compiler/interfaces";
import type { PreprocessorGroup } from "svelte/types/compiler/preprocess";
// @ts-ignore
import svelteCode from "../prebuild/svelte.js";
// @ts-ignore
import svelteInternalCode from "../prebuild/svelte_internal.js";

import {
  compile as svelteCompile,
  preprocess as sveltePreprocess,
} from "svelte/compiler";

import { transform } from "sucrase";

const svelteTsPreprocessor: PreprocessorGroup = {
  script: async ({ content, attributes, filename }: any) => {
    const out = transform(content, {
      transforms: ["typescript", "jsx"],
    });
    return { code: out.code, map: out.sourceMap };
  },
};

const svelteMarker = "svelte:";
export const sveltePlugin = ({
  emitCss = false,
  svelte: svelteOptions,
  preprocess,
  inlinedSvelte = true,
}: {
  instance?: boolean;
  emitCss: boolean;
  svelte?: CompileOptions;
  preprocess?: PreprocessorGroup[];
  inlinedSvelte?: boolean;
}) => {
  return {
    name: "uniroll-svelte",
    enforce: "pre",
    resolveId(id: string) {
      if (inlinedSvelte) {
        if (id === "svelte" || id === "svelte/internal") {
          return svelteMarker + id;
        }
      }
    },
    load(id: string) {
      if (id.startsWith(svelteMarker)) {
        if (id === "svelte:svelte") {
          return svelteCode;
        } else if (id === "svelte:svelte/internal") {
          return svelteInternalCode;
        }
      }
    },
    async transform(code: string, id: string) {
      if (id.endsWith(".svelte")) {
        const { code: preprocessed } = await sveltePreprocess(
          code,
          [svelteTsPreprocessor, ...(preprocess ?? [])],
          {
            filename: id,
          }
        );
        const result = svelteCompile(preprocessed, svelteOptions);
        if (emitCss && result.css.code) {
          const hash = Math.random().toString(32).substring(2);
          this.emitFile({
            type: "asset",
            source: result.css.code,
            fileName: `uniroll-svelte-${hash}.css`,
          } as EmittedAsset);
        }
        return result.js;
      }
    },
  } as Plugin;
};
