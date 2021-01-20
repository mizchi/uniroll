import { svelte } from "../src";
import ts from "typescript";

const svelteCode = `
<script lang="ts">
  import flatten from "lodash-es/flatten";
  import range from "https://esm.sh/lodash-es/range";
  import { onMount } from "svelte";
  let x = 1;
  onMount(() => {
    console.log(flatten([[1], 2]), range(3)));
  });
</script>
<style>
  .text {
    display: grid;
    color: red;
  }
</style>
<span class="text">{x}</span>
`;

it("bundle with svelte", async () => {
  const resolveIdFallback = (id: string) => {
    if (["svelte", "svelte/internal"].includes(id)) {
      return id;
    }
    if (id.startsWith("https://") || id.startsWith(".")) {
      return id;
    }
    return `https://esm.sh/${id}`;
  };

  const sveltePlugin = svelte({
    target: ts.ScriptTarget.ES2019,
    resolveIdFallback,
    svelteOptions: {},
  }) as any;
  const { code } = await sveltePlugin.transform(svelteCode, "/_.svelte");
  expect(code).toContain("svelte");
  expect(code).toContain("svelte/internal");
  expect(code).toContain("https://esm.sh/lodash-es/flatten");
  expect(code).not.toContain("https://esm.sh/https://");
  expect(code).not.toContain("https://esm.sh/svelte");
  expect(code).not.toContain("https://esm.sh/svelte/internal");
});

it("bundle with svelte without resolveIdFallback", async () => {
  const sveltePlugin: any = svelte({
    target: ts.ScriptTarget.ES2019,
    svelteOptions: {},
  });
  const { code } = await sveltePlugin.transform(svelteCode, "/_.svelte");
  expect(code).toContain("svelte");
  expect(code).toContain("svelte/internal");
  expect(code).toContain("lodash-es/flatten");
  expect(code).not.toContain("https://esm.sh/lodash-es/flatten");
  expect(code).not.toContain("https://esm.sh/https://");
  expect(code).not.toContain("https://esm.sh/svelte");
  expect(code).not.toContain("https://esm.sh/svelte/internal");
});
