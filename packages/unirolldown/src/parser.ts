import { codeExtractor } from "./extractor";
// import * as MDAST from "mdast";
import unified from "unified";
import toMDAST from "remark-parse";
// @ts-ignore
// import math from "remark-math/block";
// @ts-ignore
import breaks from "remark-breaks";
// @ts-ignore
// import katex from "remark-html-katex";
// @ts-ignore
import frontmatterPlugin from "remark-frontmatter";
// @ts-ignore
// import remarkMdx from "remark-mdx";
// @ts-ignore
// import squeeze from "remark-squeeze-paragraphs";
// @ts-ignore
import toHAST from "mdast-util-to-hast";
// import { parse as parseBabel } from "@babel/core";
// import { parse as parseBabel } from "@babel/core";
import { highlighter } from "./highlighter";
// import { ParseResult, ParsedImports, ParseOptions } from "..";
// @ts-ignore
import yaml from "yaml";
// import { normalizeHeading } from "./normalizeHeading";
// import { markCursorLine } from "./markCursorLine";

const vfile = require("vfile");
import visit from "unist-util-visit";

// export const codeExtractor: unified.Plugin = (options: any = {}) => {
//   return (tree) => {
//     visit(tree, "code", (node: any, index, parent) => {
//       console.log("ex", node);
//     });
//   };
// };

const fn = unified()
  .use(toMDAST as any, { footnotes: true } as any)
  // .use(markCursorLine)
  // .use(math)
  // .use(katex)
  // .use(normalizeHeading)
  .use(frontmatterPlugin, [{ type: "yaml", marker: "-" }])
  // .use(remarkMdx)
  // .use(squeeze)
  .use(breaks)
  .use(codeExtractor)
  .use(highlighter);

function parseFileToAst(file: any) {
  const internalAst = fn.parse(file);
  return fn.runSync(internalAst, file) as any;
}

export function parseFrontmatter(ast: any): object | null {
  const frontmatterNode = ast.children.find(
    (child: any) => child.type === "yaml"
  );
  if (frontmatterNode) {
    const yamlParsed = yaml.parse(frontmatterNode.value);
    return yamlParsed;
  }
  return null;
}

export function parse(code: string, options: any = {}): any {
  const errors = [];
  const file = vfile();
  file.contents = code;
  if (options.cursor) {
    file.data.cursor = options.cursor;
  }
  const amp = !!options.amp;

  const ast = parseFileToAst(file);

  // math
  ast.children.forEach((n: any, index: number) => {
    if (amp && n.type === "math") {
      const newNode = {
        type: "jsx",
        value: `<amp-mathml
          layout="container"
          data-formula="\\[${n.value}\\]"
        />`,
        position: n.position,
      };
      ast.children[index] = newNode;
    }
  });

  let frontmatter = null;
  try {
    frontmatter = parseFrontmatter(ast);
  } catch (err) {
    errors.push(err.message);
  }

  // const { exports, imports } = getImports(ast);

  const nodes = ast.children.filter(
    (c: any) => c.type !== "import" && c.type !== "export"
  );

  const newAst = {
    ...ast,
    children: nodes,
  };

  const hast = parseAstToHast(ast);

  return {
    ast: hast,
    toc: file.data.toc,
    entries: file.data.entries,
    files: file.data.files,
    // imports,
    // exports,
    frontmatter,
    errors,
  };
}

// import
// function parseImport(code: string) {
//   const parsed = parseBabel(code, {
//     babelrc: false,
//     plugins: [require("@babel/plugin-syntax-object-rest-spread")],
//   }) as any;

//   const body = parsed.program.body;
//   return body.map((line: any) => {
//     let _default;
//     let names: Array<{ local: string; imported: string }> = [];
//     line.specifiers.forEach((spec: any) => {
//       if (spec.type === "ImportDefaultSpecifier") {
//         _default = spec.local.name;
//       } else if (spec.type === "ImportSpecifier") {
//         names.push({
//           local: spec.local.name,
//           imported: spec.imported.name,
//         });
//       }
//     });
//     return {
//       default: _default,
//       names,
//       importPath: line.source.value,
//     };
//   });
// }

// export function getImports(ast: any) {
//   const exports = ast.children.filter((c: any) => c.type === "export");
//   const imports = ast.children.filter((c: any) => c.type === "import");
//   const parsedImports = parseImport(
//     imports.map((i: any) => i.value).join("\n")
//   );
//   return { exports, imports: parsedImports };
// }

// export function parseFileToAst(file: any) {
//   const internalAst = fn.parse(file);
//   return fn.runSync(internalAst, file) as any;
// }

export function parseAstToHast(ast: any) {
  return toHAST(ast, {
    handlers: {
      // TODO: test
      inlineCode(h: any, node: any) {
        return {
          ...node,
          type: "element",
          tagName: "code",
          properties: {},
          children: [
            {
              type: "text",
              value: node.value,
            },
          ],
        };
      },
      // jsx(h: any, node: MDXNode) {
      //   const parsed = parseJSX(node.value);
      //   return { ...node, type: "jsx", value: parsed };
      // },
      // comment(h: any, node: MDXNode) {
      //   return { ...node, type: "commment" };
      // },
    },
    // allowDangerousHtml: true,
  });
}
