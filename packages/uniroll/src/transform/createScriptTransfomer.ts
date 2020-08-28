import ts from "typescript";

const defaultCompilerOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2019,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  esModuleInterop: true,
  jsx: ts.JsxEmit.React,
};

export const createScriptTransformer = ({
  tsconfig,
}: {
  tsconfig?: object | string;
}) => {
  const opts = tsconfig
    ? getCompilerOptionsFromConfig(tsconfig)
    : defaultCompilerOptions;

  return async (code: string, filename: string): Promise<{ code: string }> => {
    const out = ts.transpileModule(code, {
      fileName: filename,
      compilerOptions: opts,
    });
    return {
      code: out.outputText,
    };
  };
};

function getCompilerOptionsFromConfig(tsconfig: object | string) {
  const rawjson =
    typeof tsconfig === "object" ? JSON.stringify(tsconfig) : tsconfig;
  const config = ts.convertCompilerOptionsFromJson(
    rawjson,
    "/",
    "/tsconfig.json"
  );
  return config.options;
}
