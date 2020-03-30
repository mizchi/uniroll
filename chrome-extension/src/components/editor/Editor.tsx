import "./__pre";
import * as monaco from "monaco-editor";
import "monaco-editor/esm/vs/basic-languages/css/css.contribution.js";
import "monaco-editor/esm/vs/basic-languages/html/html.contribution.js";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js";
// languages
import "monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution.js";
import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js";
import "monaco-editor/esm/vs/editor/browser/controller/coreCommands.js";
import "monaco-editor/esm/vs/editor/contrib/clipboard/clipboard.js";
import "monaco-editor/esm/vs/editor/contrib/find/findController.js";
import "monaco-editor/esm/vs/editor/contrib/folding/folding.js";

import React, { useLayoutEffect, useRef } from "react";

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_moduleId: string, _label: string) {
    return new Worker("monaco-editor/esm/vs/editor/editor.worker.js", {
      type: "module"
    });
  }
};

export default (props: {
  value: string;
  language?: "typescript" | "css" | "javascript";
  onChangeValue: (value: string) => void;
}) => {
  const editorRef = useRef(null as any);

  useLayoutEffect(() => {
    if (editorRef.current) {
      // monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      //   noSemanticValidation: false,
      //   noSyntaxValidation: false
      // });
      // monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      //   // jsx: 'react',
      //   jsx: monaco.languages.typescript.JsxEmit.React,
      //   jsxFactory: "React.createElement",
      //   reactNamespace: "React",
      //   allowNonTsExtensions: true,
      //   allowJs: true,
      //   target: monaco.languages.typescript.ScriptTarget.Latest
      // });
      const newEditor = monaco.editor.create(editorRef.current, {
        value: props.value,
        language: props.language,
        theme: "vs-dark",
        scrollbar: {
          arrowSize: 11
        },
        fontSize: 16,
        wordWrap: "on",
        wordWrapMinified: true,
        minimap: {
          enabled: false
        },
        lineNumbers: "on"
      });
      newEditor.updateOptions({ tabSize: 2 });
      newEditor.onDidChangeModelContent(event => {
        const value = newEditor.getValue();
        props.onChangeValue(value);
      });
      const rect = editorRef.current.getBoundingClientRect();
      newEditor.layout({ width: rect.width, height: rect.height });
      newEditor.focus();

      return () => {
        const p = newEditor.getPosition() as monaco.Position;
        // const offset = newEditor.getOffsetForColumn(p.lineNumber, p.column);
        newEditor.dispose();
      };
    }
  }, []);

  return (
    <div
      ref={editorRef}
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        maxHeight: "100%"
      }}
    />
  );
};
