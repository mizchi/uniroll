import "regenerator-runtime";
import { rollup } from "rollup";
import { dev } from "../src/config/dev";
import { createMemoryFs } from "../src/index";
import { Plugin } from "rollup";
import { compile as svelteCompile, preprocess } from "svelte/compiler";
import { PreprocessorGroup } from "svelte/types/compiler/preprocess";

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

export const sveltePlugin: (opts: {
  preprocess: PreprocessorGroup[];
}) => Plugin = (opts) => {
  return {
    name: "svelte",
    async transform(code: string, id: string) {
      if (id.endsWith(".svelte")) {
        const { code: preprocessed } = await preprocess(code, opts.preprocess, {
          filename: id,
        });
        const result = svelteCompile(preprocessed, {});
        if (result.warnings.length > 0) {
          this.warn(result.warnings.map((t) => t.message).join("\n"));
        }
        return result.js;
      }
    },
  };
};

(async () => {
  const files = {
    "/index.ts": appCode,
    "/app.svelte": svelteTsCode,
  };
  const memfs = createMemoryFs(files);
  const { scriptTransform, plugins } = dev({ fs: memfs });

  // const transform = createScriptTransformer({});
  const plugin = sveltePlugin({
    preprocess: [
      {
        async script({ content, attributes, filename }) {
          if (attributes.lang === "ts") {
            // 内部的に tsx 拡張子ということにする
            const ret = await scriptTransform(content, filename + "$.tsx");
            return ret;
          }
        },
      },
    ],
  });
  const rolled = await rollup({
    input: "/index.ts",
    plugins: [plugin, ...plugins],
  });
  const out = await rolled.generate({
    file: "index.js",
    format: "iife",
    name: "playground",
  });
  const code = out.output[0].code;
  eval(code);
})();
