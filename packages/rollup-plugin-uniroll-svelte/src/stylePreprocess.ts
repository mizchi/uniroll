import { Preprocessor } from "svelte/types/compiler/preprocess";

export const createStylePreprocessor = ({}: {}) => {
  const style: Preprocessor = async ({ content, attributes, filename }) => {
    return {
      code: content,
    };
  };
  return {
    style,
  };
};

// @ts-ignore
// import precss from "precss";
// import postcss from "postcss";
// import autoprefixer from "autoprefixer";
// async function transformWithAutoprefixer(input: string) {
//   const result = await postcss([
//     precss,
//     autoprefixer({
//       // @ts-ignore
//       grid: true,
//       overrideBrowserslist: ["last 2 versions", "ie 11"],
//     }),
//   ]).process("/* autoprefixer grid: autoplace */\n" + input, {
//     from: undefined,
//   });
//   return result.css;
// }
