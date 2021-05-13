import { expose } from "comlink";
import { bundle } from "uniroll";
import { svelte } from "rollup-plugin-uniroll-svelte";

const api = {
  async bundle(code: string) {
    const build = await bundle({
      input: "/index.tsx",
      files: {
        "/App.svelte": `
          <h1>hello</h1>
        `,
        "/main.ts": code,
        "/index.tsx": `
        import "./main";
        import App from "./App.svelte";
        console.log(App);
        `,
      },
      extraPlugins: [
        svelte({
          emitCss: false,
        }),
      ],
    });
    const out = await build.generate({ format: "iife" });
    return out.output[0].code;
  },
};

expose(api);

export type WorkerApi = typeof api;
