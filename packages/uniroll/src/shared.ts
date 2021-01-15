import { RollupReplaceOptions } from "@rollup/plugin-replace";
import ts from "typescript";
import { ImportMaps } from "./types";

const defaultCdnPrefix = "https://esm.sh/";

export function createImportMapsFallback(opts: {
  cdnPrefix?: string;
  importmaps: ImportMaps;
}) {
  const cdnPrefix = opts.cdnPrefix ?? defaultCdnPrefix;
  return (
    id: string,
    importer: string | void = undefined,
    warn: (warning: any) => any
  ) => {
    if (importer == null) return;
    if (id.startsWith("http")) return;
    if (id.startsWith(".")) return;
    // importmaps
    const mapped = opts.importmaps?.imports[id];
    if (mapped) {
      return mapped;
    }
    // fallback
    warn(`[uniroll] missed fallback to ${cdnPrefix}${id}`);
    return `${cdnPrefix}${id}`;
  };
}

export const transform = ({
  rewriteCdnPrefix,
  compilerOptions,
}: {
  rewriteCdnPrefix?: string;
  compilerOptions: ts.CompilerOptions;
}) => {
  return {
    name: "transform",
    transform(code: string, id: string) {
      if (id.endsWith(".ts") || id.endsWith(".tsx")) {
        const compiled = ts.transpileModule(code, {
          fileName: id,
          compilerOptions: compilerOptions,
          transformers: rewriteCdnPrefix
            ? {
                before: [cdnRewriteTransformerFactory(rewriteCdnPrefix)],
              }
            : undefined,
        });
        return {
          code: compiled.outputText,
          map: compiled.sourceMapText,
        };
      }
    },
  };
};

// Example.
//     import foo from "foo";
// =>  import foo from "https://esm.sh/foo";
export const cdnRewriteTransformerFactory = (cdnPrefix: string) => (
  ctx: ts.TransformationContext
) => {
  function visitNode(node: ts.Node): ts.Node {
    if (ts.isImportDeclaration(node)) {
      const specifier = node.moduleSpecifier.getText();
      const trim = specifier.slice(1, specifier.length - 1);
      const result = rewriteSpecifier(trim, cdnPrefix);

      return ts.factory.updateImportDeclaration(
        node,
        node.decorators,
        node.modifiers,
        node.importClause,
        ts.factory.createStringLiteral(result)
      );
    }
    // return node;
    return ts.visitEachChild(node, visitNode, ctx);
  }

  return (source: ts.SourceFile) =>
    ts.factory.updateSourceFile(
      source,
      ts.visitNodes(source.statements, visitNode)
    );
};

export function extractImportSpecfiers(codes: string[]) {
  const urls: string[] = [];
  for (const code of codes) {
    const source = ts.createSourceFile(
      "file:///_.tsx",
      code,
      ts.ScriptTarget.ESNext
    );
    source.statements.forEach((node) => {
      if (ts.isImportDeclaration(node)) {
        const target = node.moduleSpecifier.getText(source);
        const trimed = target.substr(1, target.length - 2);
        if (urls.findIndex((t) => t === trimed) === -1) {
          urls.push(trimed);
        }
      }
    });
  }
  return urls;
}

const rewriteSpecifier = (specifier: string, cdnPrefix: string) => {
  // relative path
  if (specifier.startsWith(".")) {
    return specifier;
  }

  // https direct
  if (specifier.startsWith("https://")) {
    return specifier;
  }
  return `${cdnPrefix}${specifier}`;
};

export const defaultCompilerOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2019,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  esModuleInterop: true,
  jsx: ts.JsxEmit.React,
  resolveJsonModule: true,
};

export const defaultDefine: RollupReplaceOptions = {
  "process.env.NODE_ENV": JSON.stringify("development"),
  delimiters: ["", ""],
};

export const defaultImportMaps: ImportMaps = {
  imports: {},
};

export const defaultCache = new Map();
