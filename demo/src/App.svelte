<script lang="ts">
  import { onMount } from "svelte";
  import { api } from "./api";
  import { createCodeEditor } from "./monaco_helper";
  onMount(() => {
    createCodeEditor(editorElement, code, (editor) => {
      const newCode = editor.getValue();
      code = newCode;
    });
  });

  let id = null;

  function runPreview() {
    if (id) {
      clearTimeout(id);
    }

    previewState = {
      type: "normal",
      message: "...input",
    };
    id = setTimeout(async () => {
      let builtCode: string | null = null;
      try {
        previewState = {
          type: "normal",
          message: "...building",
        };

        builtCode = await api.bundle({
          "/App.svelte": code,
          "/index.tsx": `
        import App from "./App.svelte";
        window.__run = (el) => {
          const app = new App({ target: el });
          window.__destroy = () => app.$destroy();
        }
        `,
        });
      } catch (err) {
        console.error(err);
        previewState = {
          type: "alert",
          message: err.message,
        };
      }

      if (builtCode) {
        // console.log(x);
        try {
          const e = eval;
          e(builtCode);
          previewState = null;
        } catch (err) {
          previewState = {
            type: "alert",
            message: err.message,
          };
        }
        // @ts-ignore
        window.__destroy?.();
        // @ts-ignore
        window.__run(preview);
        id = null;
      }
    }, 300);
  }
  $: if (code) {
    runPreview();
  }

  let code = `\<script\>
import { onMount } from "svelte";
let x: number = 1;
onMount(() => {
  x = 2;
});
\<\/script\>
<div>
  <h1>hello, {x}</h1>
</div>
`;

  let editorElement;
  let preview;

  let previewState:
    | {
        type: "alert";
        message: string;
      }
    | {
        type: "normal";
        message: string;
      }
    | null = null;

</script>

<main class="root">
  <div class="editor" bind:this={editorElement} />
  <div class="preview">
    <div class="preview-state">
      {#if previewState?.type === "alert"}
        <div style="background-color: red; color: white;">
          {previewState.message}
        </div>
      {/if}
      {#if previewState?.type === "normal"}
        {previewState.message}
      {/if}
    </div>
    <div class="preview-root" bind:this={preview} />
  </div>
</main>

<style>
  .root {
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 100vh;
  }
  .editor {
    height: 100vh;
    width: 50vw;
    overflow: none;
  }
  .preview {
    height: 100vh;
    width: 50vw;
    overflow: none;
  }
  .preview-state {
    height: 34px;
    width: 100%;
  }
  .preview-root {
    width: 100%;
  }

</style>
