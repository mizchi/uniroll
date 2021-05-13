import type monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

// @ts-ignore
globalThis.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

let _monaco: typeof monaco | null = null;
export async function ensureMonaco() {
  if (_monaco) return _monaco;
  const mod = await import("monaco-editor");
  _monaco = mod;
  return _monaco;
}

export async function createCodeEditor(
  editorElement: HTMLElement,
  code: string,
  onDidChangeModelContent: (editor: monaco.editor.IStandaloneCodeEditor) => void
) {
  const monaco = await ensureMonaco();
  const editor = monaco.editor.create(editorElement, {
    language: "typescript",
    lineNumbers: "off",
    scrollBeyondLastLine: false,
    minimap: {
      enabled: false,
    },
    fontSize: 16,
  });
  editor.updateOptions({
    tabSize: 2,
  });

  const model = monaco.editor.createModel(code, "html");
  editor.setModel(model);
  editor.onDidChangeModelContent(() => onDidChangeModelContent(editor));

  const observer = new ResizeObserver((entries) => {
    editor.layout();
  });
  observer.observe(editorElement);

  return editor;
}
