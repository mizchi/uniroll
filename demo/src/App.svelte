<script lang="ts">
  import { wrap } from "comlink";

  import { onMount } from "svelte";
  import type { WorkerApi } from "./uniroll";

  import { api } from "./api";

  onMount(async () => {
    const x = await api.foo();
    console.log(x);
  });
</script>

<main>
  <h1>hello</h1>
</main>
