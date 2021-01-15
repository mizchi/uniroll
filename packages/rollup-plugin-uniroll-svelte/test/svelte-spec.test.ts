import * as svelte from "svelte/compiler";
import { rollup } from "rollup";
import { virtualFs } from "rollup-plugin-virtual-fs";
const code = `
<script>
  import { onMount } from "svelte";
  let x = 1;
  onMount(() => {
    console.log("xxx")
  })
</script>
<span>x</span>
`;

it("test", () => {
  // rollup =
  const ret = svelte.compile(code);
  console.log(ret.js.code);
});
