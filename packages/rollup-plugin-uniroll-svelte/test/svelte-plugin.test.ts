import { ResolveIdFallback } from "rollup-plugin-http-resolve";
import fetch from "isomorphic-unfetch";
import { bundle } from "uniroll";
import { svelte } from "../src";
import ts from "typescript";
import { Plugin } from "rollup";
import { createStylePreprocessor } from "../src/server/stylePreprocessor";
import { css } from "rollup-plugin-uniroll-css";
global.fetch = fetch;

const resolveIdFallback: ResolveIdFallback = (
  id: string,
  importer?: string
) => {
  if (importer == null) {
    return;
  }
  if (id.startsWith("/svelte-generated-css")) {
    return;
  }
  if (id.startsWith(".")) {
    return;
  }
  if (["svelte", "svelte/internal"].includes(id)) {
    return `https://cdn.skypack.dev/${id}`;
  }
  if (id.startsWith("https://") || id.startsWith(".")) {
    return id;
  }
  return `https://esm.sh/${id}`;
};

it("bundle with svelte", async () => {
  const bundled = await bundle({
    // resolveIdFallback: "https://cdn.skypack.dev/",
    resolveIdFallback,
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
        resolveIdFallback,
        svelteOptions: {},
      }) as any,
    ],
  });

  const out = await bundled.generate({ format: "es" });
  expect(out.output[0].code).toMatchSnapshot();
});

it("bundle for es5", async () => {
  const bundled = await bundle({
    resolveIdFallback,
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
        resolveIdFallback,
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
