import { expose } from "comlink";
import { bundle } from "uniroll-light";
import { svelte, svelteResolve } from "rollup-plugin-uniroll-svelte";

const api = {
  async bundle(files: any) {
    const out = await bundle({
      input: "/index.tsx",
      files: files,
      plugins: [
        { ...svelteResolve(), enforce: "pre" },
        svelte({
          emitCss: false,
        }),
      ],
    });
    return out.output[0].code;
  },
};

expose(api);

export type WorkerApi = typeof api;
