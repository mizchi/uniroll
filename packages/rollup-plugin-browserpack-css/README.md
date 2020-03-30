## Example with optimization

```ts
// @ts-ignore
import precss from "precss";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import nano from "cssnano";

// NOTE: サーバーでだけ使う
const prefix = `/* autoprefixer grid: autoplace */\n`;
export async function transformCss(input: string) {
  const result = await postcss([
    precss,
    autoprefixer({
      overrideBrowserslist: ["last 2 versions", "ie 11"]
    }),
    nano
  ]).process(prefix + input, { from: undefined });
  return result.css;
}
```
