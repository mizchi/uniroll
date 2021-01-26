import {
  Preprocessor,
  PreprocessorGroup,
} from "svelte/types/compiler/preprocess";
// @ts-ignore
import precss from "precss";
import postcss from "postcss";
import autoprefixer from "autoprefixer";

export const createStylePreprocessor = (
  opts: {
    autoprefixer?: autoprefixer.Options;
  } = {}
): PreprocessorGroup => {
  const styleProcessor: Preprocessor = async ({
    content,
    attributes,
    filename,
  }) => {
    const result = await postcss([
      precss,
      autoprefixer(
        opts.autoprefixer ?? {
          // @ts-ignore
          grid: true,
          overrideBrowserslist: ["last 2 versions", "ie 11"],
        }
      ),
    ]).process("/* autoprefixer grid: autoplace */\n" + content, {
      from: undefined,
    });
    return {
      code: result.css,
      map: result.map,
    };
  };
  return {
    style: styleProcessor,
  } as PreprocessorGroup;
};
