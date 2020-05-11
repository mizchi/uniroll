// import "./__pre";
import * as monaco from "monaco-editor";
// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_moduleId: string, label: string) {
    if (label === "json") {
      return new Worker("./json.worker");
    }
    if (label === "css") {
      return new Worker("./css.worker.js");
    }
    if (label === "html") {
      return new Worker("./html.worker.js");
    }
    if (label === "typescript") {
      return new Worker("./ts.worker.js");
    }
    return new Worker("./editor.worker.js");
  },
};

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true, // This line disables errors in jsx tags like <div>, etc.
});
const compilerOptions: monaco.languages.typescript.CompilerOptions = {
  allowJs: true,
  allowSyntheticDefaultImports: true,
  alwaysStrict: true,
  esModuleInterop: true,
  forceConsistentCasingInFileNames: true,
  isolatedModules: true,
  jsx: monaco.languages.typescript.JsxEmit.React,
  module: monaco.languages.typescript.ModuleKind.ESNext,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  noEmit: true,
  resolveJsonModule: true,
  strict: true,
  target: monaco.languages.typescript.ScriptTarget.ESNext,
  paths: {
    "*": ["*", "*.native", "*.ios", "*.android"],
  },
};

monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
  compilerOptions
);

const extraLib = `
"declare module '*';
`;

monaco.languages.typescript.typescriptDefaults.addExtraLib(
  extraLib,
  "decls.d.ts"
);
