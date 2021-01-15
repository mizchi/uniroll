import fetch from "isomorphic-unfetch";
import { bundle } from "uniroll";
import { svelte } from "../src";
import ts from "typescript";
import { Plugin } from "rollup";
global.fetch = fetch;

it("bundle with svelte", async () => {
  const bundled = await bundle({
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
  console.log(out.output[0].code);
});

it.only("bundle with svelte", async () => {
  const bundled = await bundle({
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
    compilerOptions: {
      target: ts.ScriptTarget.ES5,
    },
    extraPlugins: [
      svelte({
        target: ts.ScriptTarget.ES5,
        cdnPrefix: "https://esm.sh/",
        svelteOptions: {
          legacy: true,
        },
      }) as Plugin,
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
            console.log("lib preprocessed");
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
  console.log(out.output[0].code);
});
