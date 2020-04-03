import cssnano from "cssnano";
// @ts-ignore
import precss from "precss";
import postcss from "postcss";
import autoprefixer from "autoprefixer";

export async function optimize(css: string): Promise<string> {
  return await transformWithAutoprefixer(css);
}

async function transformWithAutoprefixer(input: string) {
  const result = await postcss([
    precss,
    autoprefixer({
      // @ts-ignore
      grid: true,
      overrideBrowserslist: ["last 2 versions", "ie 11"]
    }),
    cssnano({
      // @ts-ignore
      autoprefixer: false
    })
  ]).process("/* autoprefixer grid: autoplace */\n" + input, {
    from: undefined
  });
  return result.css;
}

// How to use
// async function main() {
//   try {
//     const ret = await optimize(`body { color: red;  }`);
//     console.log(ret);
//   } catch (err) {
//     console.error(err);
//   }
// }

// main();
