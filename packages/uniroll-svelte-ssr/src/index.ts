import type { RollupOptions } from "rollup";
import { bundle } from "uniroll-light/dist/index.cjs.js";
import { svelte, svelteResolve } from "rollup-plugin-uniroll-svelte";
import vm from "vm";
import path from "path";

type RenderStaticOptions = RollupOptions & {
  files: any;
  ssrTarget: string;
  props: any;
};

async function renderToStaticAssets({
  ssrTarget,
  props,
  ...options
}: RenderStaticOptions): Promise<{ html: string; css: string }> {
  let rel = path.relative("/", ssrTarget);
  rel = rel.startsWith(".") ? rel : "./" + rel;
  const out = await bundle({
    input: "/__ssr__.ts",
    plugins: [
      { ...svelteResolve(), enforce: "pre" },
      svelte({
        emitCss: true,
        svelte: {
          hydratable: true,
          generate: "ssr",
          css: false,
        },
      }),
    ],
    files: {
      ...options.files,
      "/__ssr__.ts": `import App from './${rel}';
out = App.render(${JSON.stringify(props)});`,
    },
  });
  const code = out.output[0].code;
  const sandbox: any = { out: Object.create(null) };

  vm.runInNewContext(code, sandbox);

  const html: string = sandbox.out.html;

  let css = ``;
  for (const output of out.output) {
    if (
      output.type === "asset" &&
      output.fileName.startsWith("uniroll-svelte")
    ) {
      css += output.source;
    }
  }

  return { html, css };
}

export async function renderToStaticContents(
  opts: RenderStaticOptions
): Promise<{
  html: string;
  css: string;
  js: string;
}> {
  const { html, css } = await renderToStaticAssets(opts);
  const out = await bundle({
    ...opts,
    plugins: [
      { ...svelteResolve(), enforce: "pre" },
      svelte({
        emitCss: false,
        svelte: {
          hydratable: true,
          generate: "dom",
          css: false,
        },
      }),
    ],
  });
  const js = out.output[0].code;
  return {
    html,
    css,
    js,
  };
}
