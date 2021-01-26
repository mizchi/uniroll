# rollup-plugin-http-resolve

```
npm install rollup-plugin-http-resolve --save
```

## Example

```ts
// rollup.config.js
import { httpResolve } from "rollup-plugin-http-resolve";
export default {
  input: "index.js",
  plugins: [
    httpResolve({
      cache,
    }),
  ],
};
```

## Example: CDN Resolve

```ts
const vol = Volume.fromJSON({
  "/index.js": `
    import {h} from "preact";
    console.log(h);
    `,
});

const memfs = createFs(vol) as IPromisesAPI;
const rolled = await rollup({
  input: "/index.js",
  plugins: [
    httpResolve({
      fallback(id) {
        // Avoid local relative path
        if (!id.startsWith(".")) {
          return `https://esm.sh/${id}`;
        }
      },
    }),
    memfsPlugin(memfs),
  ],
});
const out = await rolled.generate({ format: "es" });
const code = out.output[0].code;
```

## With transform import

Rewrite `https://` code by your self.

```js
import ts from "typescript";
export default {
  plugins: [
    httpResolve(),
    {
      name: "transform-cdn",
      transform(code, id) {
        if (id?.startsWith("https://")) {
          const out = ts.transpileModule(code, {
            compilerOptions: {
              module: ts.ModuleKind.ESNext,
              target: ts.ScriptTarget.ES5,
            },
          });
          return {
            code: out.outputText,
            map: out.sourceMapText,
          };
        }
      },
    },
  ],
});
```

## LICENSE

MIT
