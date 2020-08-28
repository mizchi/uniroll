import "regenerator-runtime";
import { compile } from "../src";

const appCode = `import App from './app.svelte';
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
  export let name: string;
  export let counter: number = 0;
  setInterval(() => counter++, 1000);
</script>
<main>
  <span>Hello {name} {counter}</span>
</main>
`;

(async () => {
  const files = {
    "/index.tsx": appCode,
    "/app.svelte": svelteTsCode,
  };
  const rolled = await compile({ files, input: "/index.tsx" });
  const out = await rolled.generate({
    file: "index.js",
    format: "iife",
    name: "playground",
  });
  const code = out.output[0].code;
  eval(code);
})();
