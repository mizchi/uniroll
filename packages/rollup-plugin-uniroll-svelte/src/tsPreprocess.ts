import { Preprocessor } from "svelte/types/compiler/preprocess";
import ts from "typescript";
import { ResolveIdFallback } from "./types";

export const createSveltePreprocessor = ({
  resolveIdFallback,
  importer,
  target,
}: {
  resolveIdFallback: ResolveIdFallback;
  importer: string;
  target: ts.ScriptTarget;
}) => {
  const script: Preprocessor = async ({ content, attributes, filename }) => {
    const out = transpileSvelteTypeScript(content, {
      fileName: filename ?? "/$$.tsx",
      resolveIdFallback,
      importer,
      target,
    });
    return { code: out.outputText, map: out.sourceMapText };
  };
  return {
    script,
  };
};

const svelteTSCompilerOptions: ts.CompilerOptions = {
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.ESNext,
  importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Error,
  types: ["svelte"],
  isolatedModules: true,
  sourceMap: true,
  allowJs: true,
  strict: false,
  esModuleInterop: true,
  skipLibCheck: true,
  forceConsistentCasingInFileNames: true,
  resolveJsonModule: true,
};

function transpileSvelteTypeScript(
  code: string,
  opts: {
    importer?: string;
    fileName: string;
    resolveIdFallback: ResolveIdFallback;
    target: ts.ScriptTarget;
  }
): ts.TranspileOutput {
  const out = ts.transpileModule(code, {
    fileName: opts.fileName,
    compilerOptions: { ...svelteTSCompilerOptions, target: opts.target },
    transformers: {
      before: [
        cdnRewriteTransformerFactory(opts.resolveIdFallback, opts.importer),
        importTransformer,
      ],
    },
  });
  // throw out.outputText;

  return out;
}

// https://github.com/sveltejs/svelte-preprocess/blob/master/src/transformers/typescript.ts#L35-L54
const importTransformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  const visit: ts.Visitor = (node) => {
    if (ts.isImportDeclaration(node)) {
      return ts.factory.createImportDeclaration(
        node.decorators,
        node.modifiers,
        node.importClause,
        node.moduleSpecifier
      );
    }
    return node;
    // return ts.visitEachChild(node, (child) => visit(child), context);
  };
  return (node) => ts.visitNode(node, visit);
};

// Example.
//     import foo from "foo";
// =>  import foo from "https://esm.sh/foo";
export const cdnRewriteTransformerFactory = (
  resolveIdFallback: (specifier: string, importer?: string) => string | void,
  importer?: string
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
