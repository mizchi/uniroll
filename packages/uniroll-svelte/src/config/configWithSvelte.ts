import { sveltePlugin } from "../plugins/svelte-plugin";
import {
  getBaseConfig,
  UnirollOptions,
  UnirollConfigBuilderResult,
} from "uniroll";
import { Preprocessor } from "svelte/types/compiler/preprocess";

type Transform = (
  content: string,
  filename: string
) => Promise<{ code: string }>;

const createSveltePreprocessor = (transform: Transform) => {
  const script: Preprocessor = async ({ content, attributes, filename }) => {
    if (attributes.lang === "ts") {
      // 内部的に tsx 拡張子ということにする
      const ret = await transform(content, filename + "$.tsx");
      return ret;
    }
    return {
      code: content,
    };
  };
  return {
    preprocess: [
      {
        script,
      },
    ],
  };
};

export const getConfigWithSvelte = (
  opts: UnirollOptions
): UnirollConfigBuilderResult => {
  const { transformScript, plugins } = getBaseConfig(opts);
  const svelte: any = sveltePlugin(
    createSveltePreprocessor(transformScript as Transform)
  );
  return {
    transformScript,
    plugins: [svelte, ...plugins],
  };
};
