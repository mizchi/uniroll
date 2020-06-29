// @ts-ignore
import precss from "precss";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import nano from "cssnano";

test("minify", async () => {
  const prefix = `/* autoprefixer grid: autoplace */\n`;
  const result = await postcss([
    precss,
    autoprefixer({
      overrideBrowserslist: ["last 2 versions", "ie 11"],
    }),
    nano,
  ]).process(prefix + "div { display: grid; }", { from: undefined });
  expect(result.css).toMatchSnapshot();
});
