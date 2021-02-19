# uniroll-svelte-ssr

svelte ssr to static content

## install

```
npm install --save uniroll-svelte-ssr uniroll rollup typescript rollup-plugin-uniroll-svelte;
```

## Example

```ts
import { renderToStaticContents } from "uniroll-svelte-ssr";

// on node
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

(async () => {
  const { html, css, js } = await renderToStaticContents({
    input: "/index.ts",
    ssrTarget: "/App.svelte",
    files,
    props,
  });
  console.log(html, css, js);
})();
```

## LICENSE

MIT
