import { sveltePlugin } from "../plugins/svelte-plugin";
import {
  getBaseConfig,
  UnirollOptions,
  UnirollConfigBuilderResult,
} from "uniroll";
import { Preprocessor } from "svelte/types/compiler/preprocess";
// import tsconfig from "@tsconfig/svelte/tsconfig.json";
import ts from "typescript";

const tsconfig = {
  $schema: "https://json.schemastore.org/tsconfig",
  display: "Svelte",

  compilerOptions: {
    moduleResolution: "node",
    target: "es2017",
    /** 
      Svelte Preprocess cannot figure out whether you have a value or a type, so tell TypeScript
      to enforce using `import type` instead of `import` for Types.
     */
    importsNotUsedAsValues: "error",
    isolatedModules: true,
    /**
      To have warnings/errors of the Svelte compiler at the correct position,
      enable source maps by default.
     */
    sourceMap: true,
    /** Requests the runtime types from the svelte modules by default. Needed for TS files or else you get errors. */
    types: ["svelte"],

    strict: false,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
  },
};

type Transform = (
  content: string,
  filename: string
) => Promise<{ code: string }>;

// https://github.com/sveltejs/svelte-preprocess/blob/master/src/transformers/typescript.ts#L35-L54
const importTransformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  const visit: ts.Visitor = (node) => {
    if (ts.isImportDeclaration(node)) {
      if (node.importClause?.isTypeOnly) {
        return ts.createEmptyStatement();
      }
      return ts.createImportDeclaration(
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

const createSveltePreprocessor = (transformers: { style: Transform }) => {
  const script: Preprocessor = async ({ content, attributes, filename }) => {
    if (attributes.lang === "ts") {
      // 内部的に tsx 拡張子ということにする
      const opts = ts.convertCompilerOptionsFromJson(
        {
          ...tsconfig.compilerOptions,
          importsNotUsedAsValues: "error",
        },
        "/",
        "/tsconfig.json"
      );
      const out = ts.transpileModule(content, {
        fileName: "/index.tsx",
        compilerOptions: opts.options,
        transformers: {
          before: [importTransformer],
        },
      });
      return { code: out.outputText };
    }
    return {
      code: content,
    };
  };
  const style: Preprocessor = async ({ content, attributes, filename }) => {
    const ret = (await transformers.style?.(content, filename + "$$.tsx")) ?? {
      code: content,
    };
    return ret;
  };

  return {
    preprocess: [
      {
        script,
        style,
      },
    ],
  };
};

export const getConfigWithSvelte = (
  opts: UnirollOptions
): UnirollConfigBuilderResult => {
  const { transformScript, transformStyle, plugins } = getBaseConfig(opts);
  const svelte: any = sveltePlugin(
    createSveltePreprocessor({
      style: transformStyle as Transform,
    })
  );
  return {
    transformScript,
    transformStyle,
    plugins: [svelte, ...plugins],
  };
};
