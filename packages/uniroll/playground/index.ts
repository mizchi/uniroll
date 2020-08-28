import type { Plugin } from "rollup";

import "regenerator-runtime";
import { rollup } from "rollup";
import { getBaseConfig } from "../src/config/base";
import { createMemoryFs } from "../src";
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

export const getSveltePlugin: (opts: {
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

const tsRaw = `
/** @jsx h */

import foo from "./foo";
import { h, render } from "preact";
import { useState, useEffect } from "preact/hooks";

function App() {
  useEffect(() => {
    console.log("xxx");
  }, [])
  return <h1>Hello</h1>;
}

console.log(foo);
render(<App />, document.body);
`;

(async () => {
  const files = {
    "/foo.tsx": "export default 1",
    "/index.tsx": tsRaw,
    // "/index.tsx": appCode,
    // "/app.svelte": svelteTsCode,
  };
  const memfs = createMemoryFs(files);
  const { transformScript, plugins } = getBaseConfig({
    fs: memfs,
  });
  // const transform = createtransformScript({});
  const svelte = getSveltePlugin({
    preprocess: [
      {
        async script({ content, attributes, filename }) {
          if (attributes.lang === "ts") {
            // 内部的に tsx 拡張子ということにする
            const ret = await transformScript(content, filename + "$.tsx");
            return ret;
          }
          return {
            code: content,
          };
        },
      },
    ],
  });
  const rolled = await rollup({
    input: "/index.tsx",
    plugins: [svelte, ...plugins],
  });
  const out = await rolled.generate({
    file: "index.js",
    format: "iife",
    name: "playground",
  });
  const code = out.output[0].code;
  eval(code);
})();
