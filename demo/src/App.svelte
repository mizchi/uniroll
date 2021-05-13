<script lang="ts">
  import { onMount } from "svelte";
  import { api } from "./api";
  // import {} from "./"
  onMount(async () => {
    const x = await api.bundle(`console.log('hello from bundle')`);
    console.log(x);
  });
</script>

<main>
  <h1>hello</h1>
</main>
