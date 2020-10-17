import "regenerator-runtime";
import { compile } from "../src";

const appCode = `import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;
`;

const svelteTsCode = `
<script lang="ts">
  import { onMount } from "svelte";
  import { FaTimes } from "serialized-svg-icons/fa";
  // import { FaTimes as FaTimes$ } from "serialized-svg-icons/fa";
  // const FaTimes = FaTimes$;
  export let name: string;
  export let counter: number = 0;
  onMount(() => {
    setInterval(() => counter++, 1000);
  })
</script>
<style>
  span {
    display: grid;
    place-items: center;
    color: red;
  }
</style>
<main>
  <svg
    width={16}
    height={16}
    viewBox={FaTimes.attr.viewBox}
    stroke="currentColor"
    fill="currentColor"
    stroke-width="0"
  >
    <path d={FaTimes.child[0].attr.d} />
  </svg>

  <span>Hello {name} {counter}</span>
</main>
`;

(async () => {
  const files = {
    "/index.tsx": appCode,
    "/App.svelte": svelteTsCode,
  };
  const rolled = await compile({
    files,
    input: "/index.tsx",
    importmaps: {
      imports: {
        "svelte": "https://cdn.skypack.dev/svelte@3.29.0",
        "svelte/internal": "https://cdn.skypack.dev/svelte@3.29.0/internal",
        "serialized-svg-icons/fa": "https://cdn.jsdelivr.net/npm/serialized-svg-icons@4.1.0/fa/index.js"
      },
    },
  });
  const out = await rolled.generate({
    file: "index.js",
    format: "iife",
    name: "playground",
  });
  const code = out.output[0].code;
  eval(code);
})().catch((err) => {
  console.error(err);
});
