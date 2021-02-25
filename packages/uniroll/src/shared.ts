import { RollupReplaceOptions } from "@rollup/plugin-replace";
import { ResolveIdFallback } from "rollup-plugin-http-resolve";
import ts from "typescript";
import { ImportMaps } from "./types";

const skypackTargetList = [
  "svelte",
  "svelte/internal",
  "preact",
  "preact/hooks",
];

export const defaultExtractExternal = (specifiers: string[]) =>
  specifiers
    .filter((s) => !s.startsWith("."))
    .map((s) => {
      if (skypackTargetList.includes(s)) {
        return `https://cdn.skypack.dev/${s}`;
      } else {
        return `https://esm.sh/${s}`;
      }
    });

export const defaultResolveIdFallback: ResolveIdFallback = (id, importer) => {
  if (importer == null) return;
  if (id.startsWith(".")) return;
  if (id.startsWith("https://")) return id;
  if (skypackTargetList.includes(id)) {
    return `https://cdn.skypack.dev/${id}`;
  }

  return `https://esm.sh/${id}`;
};

export const transform = ({
  resolveIdFallback,
  compilerOptions,
}: {
  resolveIdFallback: ResolveIdFallback;
  compilerOptions: ts.CompilerOptions;
}) => {
  return {
    name: "transform",
    transform(code: string, id: string) {
      if (id.endsWith(".ts") || id.endsWith(".tsx")) {
        const compiled = ts.transpileModule(code, {
          fileName: id,
          compilerOptions: compilerOptions,
          transformers: {
            before: [cdnRewriteTransformerFactory(resolveIdFallback, id)],
          },
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
export const cdnRewriteTransformerFactory = (
  resolveIdFallback: ResolveIdFallback,
  importer: string
) => (ctx: ts.TransformationContext) => {
  function visitNode(node: ts.Node): ts.Node {
    if (ts.isImportDeclaration(node)) {
      if (node.importClause?.isTypeOnly) {
        return ts.factory.createEmptyStatement();
      }
      const specifier = node.moduleSpecifier.getText();
      const trim = specifier.slice(1, specifier.length - 1);
      const result = resolveIdFallback(trim, importer) || trim;

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

export const defaultCompilerOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2019,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  esModuleInterop: true,
  jsx: ts.JsxEmit.React,
  resolveJsonModule: true,
  importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Error,
};

export const defaultDefine: RollupReplaceOptions = {
  // "process.env.NODE_ENV": JSON.stringify("development"),
  delimiters: ["", ""],
};

export const defaultImportMaps: ImportMaps = {
  imports: {},
};

export const defaultCache = new Map();
