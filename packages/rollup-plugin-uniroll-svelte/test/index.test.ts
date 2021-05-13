import { svelte, svelteResolve } from "../dist/index.cjs.js";
import { virtualFs } from "rollup-plugin-virtual-fs";
import { rollup } from "rollup";

const files = {
  "/App.svelte": `
    <script lang="ts">
      import {onMount} from "svelte";
      let x: number = 1;
      onMount(() => {
        setTimeout(() => {
          x = 2
        }, 50);
      });
    </script>
    <h1>{x}</h1>
  `,
  "/index.js": `
    import App from "./App.svelte";
    new App({ target: document.querySelector("#app") });
  `,
};

it("can render and mount", async () => {
  const build = await rollup({
    input: "/index.js",
    plugins: [
      svelteResolve(),
      svelte({
        emitCss: false,
      }),
      virtualFs({
        files,
      }),
    ],
  });
  const out = await build.generate({ format: "iife" });
  const code = out.output[0].code;
  document.body.innerHTML = `
  <div id="app"></div>
  `;
  eval(code);
  expect(document.querySelector("#app")!.innerHTML).toBe("<h1>1</h1>");

  await new Promise((r) => setTimeout(r, 100));

  expect(document.querySelector("#app")!.innerHTML).toBe("<h1>2</h1>");
});
