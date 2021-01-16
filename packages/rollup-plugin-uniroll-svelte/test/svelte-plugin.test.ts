import fetch from "isomorphic-unfetch";
import { bundle } from "uniroll";
import { svelte } from "../src";
import ts from "typescript";
import { Plugin } from "rollup";
import { createStylePreprocessor } from "../src/server/stylePreprocessor";
global.fetch = fetch;

it("bundle with svelte", async () => {
  const bundled = await bundle({
    cdnPrefix: "https://cdn.skypack.dev/",
    input: "/index.tsx",
    files: {
      "/index.tsx": `
import App from "./App.svelte";
new App({target: document.body});
      `,
      "/App.svelte": `
<script lang="ts">
  let x = 1;
</script>
<style>
  .text {
    color: red;
  }
</style>
<span class="text">{x}</span>
      `,
    },
    extraPlugins: [
      svelte({
        target: ts.ScriptTarget.ES2019,
        cdnPrefix: "https://esm.sh/",
        svelteOptions: {},
      }) as any,
    ],
  });
  const out = await bundled.generate({ format: "es" });
  expect(out.output[0].code).toMatchSnapshot();
});

it("bundle for es5", async () => {
  const bundled = await bundle({
    cdnPrefix: "https://cdn.skypack.dev/",
    input: "/index.tsx",
    files: {
      "/index.tsx": `
import App from "./App.svelte";
const foo = (x: string) => console.log(x);
foo();

new App({target: document.body});
      `,
      "/App.svelte": `
<script lang="ts">
  import { onMount } from "svelte";
  let x = 1;
  onMount(() => {
    console.log("xxxx");
  });
</script>
<style>
  .text {
    display: grid;
    color: red;
  }
</style>
<span class="text">{x}</span>
      `,
    },
    compilerOptions: {
      target: ts.ScriptTarget.ES5,
    },
    extraPlugins: [
      svelte({
        target: ts.ScriptTarget.ES5,
        cdnPrefix: "https://esm.sh/",
        extraPreprocess: [
          createStylePreprocessor({
            autoprefixer: {
              // @ts-ignore
              grid: true,
              overrideBrowserslist: ["last 2 versions", "ie 11"],
            },
          }),
        ],
        svelteOptions: {
          legacy: true,
        },
      }) as Plugin,
      {
        name: "transform-cdn",
        transform(code, id) {
          if (id.startsWith("https://cdn.skypack.dev/svelte")) {
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
  const out = await bundled.generate({ format: "es" });
  expect(out.output[0].code).toContain("-ms-grid");
  expect(out.output[0].code).toContain("/** @class */");
});
