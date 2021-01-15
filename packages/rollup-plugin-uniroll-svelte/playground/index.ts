// import "regenerator-runtime";
import "./pre";
import ts from "typescript";
import { bundle } from "uniroll";
import { svelte } from "../src/index";
import { Plugin } from "rollup";
// import * as svelte$ from "svelte";
// @ts-ignore
// global.svelte = svelte$;

// TODO: Need svelte Inlining?

const appCode = `import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

// export default app;
`;

const svelteTsCode = `
<script lang="ts">
  // import { onMount } from "svelte";
  export let name: string;
  export let counter: number = 0;
  // onMount(() => {
  //   setInterval(() => counter++, 1000);
  // })
</script>
<style>
  span {
    display: grid;
    place-items: center;
    color: red;
  }
</style>
<main>
  <span>Hello {name}: {counter}</span>
</main>
`;

(async () => {
  const files = {
    "/index.tsx": appCode,
    "/App.svelte": svelteTsCode,
  };
  const rolled = await bundle({
    input: "/index.tsx",
    files,
    // files: {
    //   "/foo.js": `export default "foo";`,
    //   "/index.tsx": `import foo from "./foo"; console.log(foo)`,
    // },
    compilerOptions: {
      target: ts.ScriptTarget.ES5,
    },
    extraPlugins: [
      // @ts-ignore
      svelte({
        target: ts.ScriptTarget.ES5,
        cdnPrefix: "https://esm.sh/",
        // cdnPrefix: "https://skypack.cdn.dev/",
        svelteOptions: {
          // legacy: true,
        },
      }) as Plugin,
      // @ts-ignore
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
            // console.log("lib preprocessed");
            return {
              code: out.outputText,
              map: out.sourceMapText,
            };
          }
        },
      } as Plugin,
    ],
  });
  const out = await rolled.generate({
    file: "index.js",
    format: "iife",
    name: "__",
  });
  const code = out.output[0].code;
  console.log(code);
  eval(code);
})();
// .catch((err) => {
//   console.error(err);
// });
