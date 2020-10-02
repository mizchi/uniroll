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

const createSveltePreprocessor = (transformers: {
  script: Transform;
  style: Transform;
}) => {
  const script: Preprocessor = async ({ content, attributes, filename }) => {
    if (attributes.lang === "ts") {
      // 内部的に tsx 拡張子ということにする
      const ret = (await transformers.script(content, filename + "$.tsx")) ?? {
        code: content,
      };
      return ret;
    }
    return {
      code: content,
    };
  };
  const style: Preprocessor = async ({ content, attributes, filename }) => {
    const ret = (await transformers.style?.(content, filename + "$.tsx")) ?? {
      code: content,
    };
    return ret;
  };

  return {
    preprocess: [
      {
        script,
        style,
      },
    ],
  };
};

export const getConfigWithSvelte = (
  opts: UnirollOptions
): UnirollConfigBuilderResult => {
  const { transformScript, transformStyle, plugins } = getBaseConfig(opts);
  const svelte: any = sveltePlugin(
    createSveltePreprocessor({
      script: transformScript as Transform,
      style: transformStyle as Transform,
    })
  );
  return {
    transformScript,
    transformStyle,
    plugins: [svelte, ...plugins],
  };
};
