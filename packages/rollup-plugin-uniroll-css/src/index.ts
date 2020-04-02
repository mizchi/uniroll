import { Options } from "./types";
import { Plugin } from "rollup";
import { transformCss } from "./transformCss";
import { transformWithAutoprefixer } from "./transformWithAutoprefixer";
import { wrapWithStyleInjector } from "./wrapWithInjector";

export const css = (options: Options = {}) => {
  return {
    async transform(code: string, id: string): Promise<string | void> {
      if (id.endsWith(".css")) {
        const css = await transformCss(code, options);
        const autoprefixedCss = await transformWithAutoprefixer(css);
        return wrapWithStyleInjector(autoprefixedCss);
      }
    }
  } as Plugin;
};
