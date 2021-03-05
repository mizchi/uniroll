import html from "remark-html";
import unified from "unified";
import { bundleLocal } from "uniroll";
import u from "unist-builder";
// @ts-ignore
import refractor from "refractor/core.js";

refractor.register(require("refractor/lang/javascript.js"));
refractor.register(require("refractor/lang/jsx.js"));
refractor.register(require("refractor/lang/typescript.js"));
refractor.register(require("refractor/lang/tsx.js"));
refractor.register(require("refractor/lang/markup.js"));
refractor.register(require("refractor/lang/markdown.js"));
refractor.register(require("refractor/lang/wasm.js"));
refractor.alias({ javascript: ["js"] });
refractor.alias({ typescript: ["ts"] });
refractor.alias({ markdown: ["md", "mdx"] });
refractor.alias({ markup: ["html"] });

const compiler = unified().use(html, { sanitize: false });

export async function compile(ast: any, files: { [k: string]: string }) {
  for (const node of ast.children) {
    if (node.type === "code") {
      node.data ??= {};
      node.data.hName = "div";
      node.data.hProperties = {};
      node.data.hChildren = [];
      if (node.lang && refractor.registered(node.lang)) {
        const highlighted = refractor.highlight(node.value, node.lang);
        node.data.hChildren.push(
          u("element", {
            tagName: "div",
            children: highlighted,
          })
        );
      }

      if (node.data?.isRunner) {
        const ret = await bundleLocal({
          input: "/$$.tsx",
          files: {
            ...files,
            "/$$.tsx": node.value,
          },
        });
        const out = await ret.generate({ format: "es" });
        const code = out.output[0].code;
        const encoded = Buffer.from(
          unescape(encodeURIComponent(code))
        ).toString("base64");
        const w = node.data.runner.params?.width ?? "100%";
        const h = node.data.runner.params?.height ?? "300px";

        const id = "unirolldown_id_" + Math.random().toString();
        node.data.hChildren.push(
          u("element", {
            tagName: "button",
            properties: {
              className: "js-unirolldown-run-button",
              style: "display: block;",
              "data-id": id,
            },
            children: [
              {
                type: "text",
                value: "run",
              },
            ],
          })
        );
        node.data.hChildren.push(
          u("element", {
            tagName: "iframe",
            properties: {
              style: `width:${w};height:${h}`,
              className: "js-unirolldown-iframe",
              sandbox: "allow-scripts",
              "data-id": id,
              "data-env": node.data.runner.env,
              "data-encoded": encoded,
            },
          })
        );
      }
    }
  }

  return compiler.stringify(ast);
}
