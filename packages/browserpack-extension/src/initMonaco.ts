import "./__pre";
import * as monaco from "monaco-editor";
// import "monaco-editor/esm/vs/basic-languages/css/css.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/html/html.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js";
// // languages
// import "monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js";
// import "monaco-editor/esm/vs/editor/browser/controller/coreCommands.js";
// import "monaco-editor/esm/vs/editor/contrib/clipboard/clipboard.js";
// import "monaco-editor/esm/vs/editor/contrib/find/findController.js";
// import "monaco-editor/esm/vs/editor/contrib/folding/folding.js";

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_moduleId: string, _label: string) {
    return new Worker("monaco-editor/esm/vs/editor/editor.worker.js");
  }
};
