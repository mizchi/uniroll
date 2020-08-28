import { sveltePlugin } from "../plugins/svelte-plugin";
import {
  getBaseConfig,
  UnirollOptions,
  UnirollConfigBuilderResult,
} from "uniroll";

export const getConfigWithSvelte = (
  opts: UnirollOptions
): UnirollConfigBuilderResult => {
  const { transformScript, plugins } = getBaseConfig(opts);
  const svelte: any = sveltePlugin({
    preprocess: [
      {
        async script({ content, attributes, filename }) {
          if (attributes.lang === "ts") {
            // 内部的に tsx 拡張子ということにする
            const ret = await transformScript(content, filename + "$.tsx");
            return ret;
          }
          return {
            code: content,
          };
        },
      },
    ],
  });
  return {
    transformScript,
    plugins: [svelte, ...plugins],
  };
};
