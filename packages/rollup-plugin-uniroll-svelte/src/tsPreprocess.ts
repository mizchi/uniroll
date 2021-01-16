import { Preprocessor } from "svelte/types/compiler/preprocess";
import ts from "typescript";
import { cdnRewriteTransformerFactory } from "uniroll";

export const createSveltePreprocessor = ({
  cdnPrefix = "https://esm.sh/",
  target,
}: {
  cdnPrefix?: string;
  target: ts.ScriptTarget;
}) => {
  const script: Preprocessor = async ({ content, attributes, filename }) => {
    const out = transpileSvelteTypeScript(content, {
      fileName: filename ?? "/$$.tsx",
      cdnPrefix: (id: string) => {
        if (id === "svelte" || id === "svelte/internal") {
          return id;
        }
        if (id.startsWith(".")) {
          return id;
        }
        return `${cdnPrefix}${id}`;
      },
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
    fileName: string;
    cdnPrefix: (id: string) => string;
    target: ts.ScriptTarget;
  }
): ts.TranspileOutput {
  // 内部的に tsx 拡張子ということにする
  const out = ts.transpileModule(code, {
    fileName: opts.fileName ?? "/_.tsx",
    compilerOptions: { ...svelteTSCompilerOptions, target: opts.target },
    transformers: {
      before: [
        ...(opts.cdnPrefix
          ? [cdnRewriteTransformerFactory(opts.cdnPrefix)]
          : []),
        importTransformer,
      ],
    },
  });
  // debugger;
  return out;
}

// https://github.com/sveltejs/svelte-preprocess/blob/master/src/transformers/typescript.ts#L35-L54
const importTransformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  const visit: ts.Visitor = (node) => {
    if (ts.isImportDeclaration(node)) {
      if (node.importClause?.isTypeOnly) {
        return ts.factory.createEmptyStatement();
      }
      return ts.factory.createImportDeclaration(
        node.decorators,
        node.modifiers,
        node.importClause,
        node.moduleSpecifier
      );
    }
    return ts.visitEachChild(node, (child) => visit(child), context);
  };
  return (node) => ts.visitNode(node, visit);
};
