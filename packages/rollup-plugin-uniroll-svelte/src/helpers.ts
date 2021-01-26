import ts from "typescript";

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
};
