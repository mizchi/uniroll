import type { Plugin } from "rollup";
import { compile as svelteCompile, preprocess } from "svelte/compiler";
import { PreprocessorGroup } from "svelte/types/compiler/preprocess";

export const sveltePlugin: (opts: {
  preprocess: PreprocessorGroup[];
}) => Plugin = (opts) => {
  return {
    name: "svelte",
    async transform(code: string, id: string) {
      if (id.endsWith(".svelte")) {
        const { code: preprocessed } = await preprocess(code, opts.preprocess, {
          filename: id,
        });
        const result = svelteCompile(preprocessed, {});
        if (result.warnings.length > 0) {
          this.warn(result.warnings.map((t) => t.message).join("\n"));
        }
        return result.js;
      }
    },
  };
};
