# rollup-plugin-uniroll-svelte

```
$ npm install rollup-plugin-uniroll-svelte
```

## Example

```js
import ts from "typescript";
import { bundle } from "uniroll";
import { svelte } from "rollup-plugin-uniroll-svelte";
const files = {
  /* ... */
};

// NOTE: esm.sh can not resorve svelte/internal
const cdnPrefix = "https://cdn.skypack.dev/";
const rolled = await bundle({
  input: "/index.tsx",
  files,
  cdnPrefix,
  extraPlugins: [
    svelte({
      target: ts.ScriptTarget.ES2019,
      cdnPrefix,
      svelteOptions: {},
    }),
  ],
});
```

## Example: IE Support

```ts
import type { Plugin } from "rollup";
import ts from "typescript";
import { bundle } from "uniroll";
import { svelte } from "rollup-plugin-uniroll-svelte";

const files = {
  /* ... */
};
const cdnPrefix = "https://cdn.skypack.dev/";
const rolled = await bundle({
  input: "/index.tsx",
  files,
  cdnPrefix,
  compilerOptions: {
    target: ts.ScriptTarget.ES5,
  },
  extraPlugins: [
    svelte({
      target: ts.ScriptTarget.ES5,
      cdnPrefix,
      svelteOptions: {},
    }),
    {
      name: "transform-cdn",
      transform(code, id) {
        if (id.startsWith("https://")) {
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
    } as Plugin,
  ],
});
```

## Example: IE Support + AutoPrefixer

```ts
import type { Plugin } from "rollup";
import ts from "typescript";
import { bundle } from "uniroll";
import { svelte } from "rollup-plugin-uniroll-svelte";
import { createStylePreprocessor } from "rollup-plugin-uniroll-svelte/lib/server/stylePreproccessor";

const files = {
  /* ... */
};
const cdnPrefix = "https://cdn.skypack.dev/";
const rolled = await bundle({
  input: "/index.tsx",
  files,
  cdnPrefix,
  compilerOptions: {
    target: ts.ScriptTarget.ES5,
  },
  extraPlugins: [
    svelte({
      target: ts.ScriptTarget.ES5,
      cdnPrefix,
      svelteOptions: {},
      extraPreprocessor: [createStylePreprocessor()],
    }),
    {
      name: "transform-cdn",
      transform(code, id) {
        if (id.startsWith("https://")) {
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
    } as Plugin,
  ],
});
```

## LICENSE

MIT
