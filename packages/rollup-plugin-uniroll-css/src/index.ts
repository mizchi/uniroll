import { Options } from "./types";
import { Plugin } from "rollup";
import { transformCss } from "./transformCss";
import { wrapWithStyleInjector } from "./wrapWithInjector";

export const css = (options: Options = {}) => {

  const willOutputFile = !!options.output;
  let cssFiles: string[] = [];

  return {
    name: 'uniroll-css',
    buildStart() {
      cssFiles = [];
    },
    async transform(code: string, id: string): Promise<string | void> {
      if (!id.endsWith('.css')) return;
      const css = await transformCss(code, options);
      
      if (willOutputFile) {
        cssFiles.push(css);
        return;
      } else {
        return wrapWithStyleInjector(css);
      }
    },
    generateBundle() {
      if (!willOutputFile) return;
      if (cssFiles.length === 0) return;
      this.emitFile({
        type: "asset",
        fileName: options.output,
        source: cssFiles.join(""),
      });
    }
  } as Plugin;
};
