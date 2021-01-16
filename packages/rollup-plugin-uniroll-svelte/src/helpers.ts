import ts from "typescript";

// Example.
//     import foo from "foo";
// =>  import foo from "https://esm.sh/foo";
export const cdnRewriteTransformerFactory = (
  cdnPrefix: string | ((specifier: string) => string)
) => (ctx: ts.TransformationContext) => {
  function visitNode(node: ts.Node): ts.Node {
    if (ts.isImportDeclaration(node)) {
      const specifier = node.moduleSpecifier.getText();
      const trim = specifier.slice(1, specifier.length - 1);
      const result =
        typeof cdnPrefix === "string"
          ? rewriteSpecifier(trim, cdnPrefix)
          : cdnPrefix(trim);

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
