import * as monaco from "monaco-editor";
import React, { useLayoutEffect, useRef } from "react";

export default (props: {
  value: string;
  language?: "typescript" | "css" | "javascript";
  onChangeValue: (value: string) => void;
}) => {
  const editorRef = useRef(null as any);

  useLayoutEffect(() => {
    if (editorRef.current) {
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
