import breaks from "remark-breaks";
import frontmatterPlugin from "remark-frontmatter";
import html from "remark-html";
import parser from "remark-parse";
import unified from "unified";
import vfile from "vfile";
import yaml from "yaml";
import { extractor } from "./extractor";
import { VFileExtended } from "./types";

const parserFn = unified()
  .use(parser as any, { footnotes: true } as any)
  .use(frontmatterPlugin, [{ type: "yaml", marker: "-" }])
  .use(breaks)
  .use(extractor)
  .use(html);

function parseFileToAst(file: any) {
  const internalAst = parserFn.parse(file);
  return parserFn.runSync(internalAst, file) as any;
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

export function parse(code: string, options: { cursor?: any } = {}) {
  const errors = [];
  const file = vfile() as VFileExtended;
  file.contents = code;
  file.data = {
    cursor: null,
    toc: null,
    files: {},
  };

  if (options.cursor) {
    file.data.cursor = options.cursor;
  }
  const ast = parseFileToAst(file);
  let frontmatter = null;
  try {
    frontmatter = parseFrontmatter(ast);
  } catch (err) {
    errors.push(err.message);
  }
  return {
    ast: ast,
    toc: file.data.toc,
    files: file.data.files,
    frontmatter,
    errors,
  };
}
