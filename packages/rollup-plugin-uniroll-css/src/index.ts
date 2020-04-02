import { Options } from "./types";
import { Plugin } from "rollup";
import { transformCss } from "./transformCss";
import { wrapWithStyleInjector } from "./wrapWithInjector";

export const css = (options: Options = {}) => {
  return {
    async transform(code: string, id: string): Promise<string | void> {
      if (id.endsWith(".css")) {
        const css = await transformCss(code, options);
        return wrapWithStyleInjector(css);
      }
    }
  } as Plugin;
};
