import { bundle, CompileOptions } from "uniroll";
import ts from "typescript";
import { svelte } from "rollup-plugin-uniroll-svelte";
import vm from "vm";
import path from "path";

type RenderStaticOptions = Omit<CompileOptions, "input"> & {
  target: string;
  props: any;
};

async function renderToStaticAssets({
  target,
  props,
  ...options
}: RenderStaticOptions): Promise<{ html: string; css: string }> {
  let rel = path.relative("/", target);
  rel = rel.startsWith(".") ? rel : "./" + rel;
  const bundled = await bundle({
    ...options,
    input: "/__ssr__.ts",
    resolveIdFallback: options.resolveIdFallback,
    extraPlugins: [
      svelte({
        emitCss: true,
        target: ts.ScriptTarget.ES5,
        resolveIdFallback: options.resolveIdFallback,
        svelteOptions: {
          hydratable: true,
          generate: "ssr",
          css: false,
        },
      }),
      ...(options.extraPlugins ?? []),
    ],
    files: {
      ...options.files,
      "/__ssr__.ts": `import App from './${rel}';
out = App.render(${JSON.stringify(props)});`,
    },
  });
  const out = await bundled.generate({ format: "es" });
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
  const bundled = await bundle({
    input: "/index.ts",
    extraPlugins: [
      svelte({
        emitCss: false,
        target: ts.ScriptTarget.Latest,
        resolveIdFallback: opts.resolveIdFallback,
        svelteOptions: {
          hydratable: true,
          generate: "dom",
          css: false,
        },
      }),
      ...(opts.extraPlugins ?? []),
    ],
    ...opts,
  });

  const out = await bundled.generate({ format: "iife" });
  const js = out.output[0].code;
  return {
    html,
    css,
    js,
  };
}
