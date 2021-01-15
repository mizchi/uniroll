import { Preprocessor } from "svelte/types/compiler/preprocess";
import ts from "typescript";
import { cdnRewriteTransformerFactory } from "uniroll";

export const createSveltePreprocessor = ({
  cdnPrefix,
  target,
}: {
  cdnPrefix?: string;
  target: ts.ScriptTarget;
}) => {
  const script: Preprocessor = async ({ content, attributes, filename }) => {
    const out = transpileSvelteTypeScript(content, {
      fileName: filename,
      cdnPrefix,
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
  /** 
    Svelte Preprocess cannot figure out whether you have a value or a type, so tell TypeScript
    to enforce using `import type` instead of `import` for Types.
   */
  // importsNotUsedAsValues: "error",
  importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Error,
  types: ["svelte"],
  isolatedModules: true,
  /**
    To have warnings/errors of the Svelte compiler at the correct position,
    enable source maps by default.
   */
  sourceMap: true,
  allowJs: true,
  /** Requests the runtime types from the svelte modules by default. Needed for TS files or else you get errors. */
  strict: false,
  esModuleInterop: true,
  skipLibCheck: true,
  forceConsistentCasingInFileNames: true,
  resolveJsonModule: true,
};

function transpileSvelteTypeScript(
  code: string,
  opts: { fileName?: string; cdnPrefix?: string; target: ts.ScriptTarget }
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
