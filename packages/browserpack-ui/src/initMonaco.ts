import "./__pre";
import * as monaco from "monaco-editor";
// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_moduleId: string, _label: string) {
    return new Worker("monaco-editor/esm/vs/editor/editor.worker.js");
  }
};
