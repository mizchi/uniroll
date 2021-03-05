import { renderToStaticContents } from "../src";
import fetch from "isomorphic-unfetch";

global.fetch = fetch;

const props = { foo: "hello" };
const App = `
<script lang="ts">
  export let foo: string;
  import { onMount } from 'svelte';
  let n = 0;
  const onClick = () => {
    n = n + 1
  }

  let mounted = false;
  onMount(() => {
    mounted = true;
  });
</script>

{#if mounted}hydrated{/if}
<button on:click={onClick}>{foo}{n}</button>

<style>
  button {
    color: red;
  }
</style>
`;

const files = {
  "/App.svelte": App,
  "/index.ts": `
import App from './App.svelte';
new App({
  target: document.querySelector("main"),
  hydrate: true,
  props: ${JSON.stringify(props)}
});
`,
};

jest.setTimeout(30 * 1000);
it("render", async () => {
  const { html, css, js } = await renderToStaticContents({
    input: "/index.ts",
    ssrTarget: "/App.svelte",
    files,
    props,
  });
  expect(html).toContain("hello0");
  expect(css).toContain("color:red");
});
