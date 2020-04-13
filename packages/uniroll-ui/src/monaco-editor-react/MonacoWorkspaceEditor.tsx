import "./initMonaco";
import * as monaco from "monaco-editor";

import React, { useRef, useState, useEffect } from "react";
import { restoreFromJSON, findModel, disposeAll } from "./monacoFs";
import { useAppState } from "../components/contexts";

export default React.memo(() => {
  const { files, currentFilepath, onSetFiles } = useAppState();

  const editorRef = useRef<HTMLDivElement>(null as any);

  const [
    currrentEditor,
    setCurrentEditor,
  ] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    console.log("remount");
    restoreFromJSON(files);
  }, [files]);

  // initialize once
  useEffect(() => {
    let newEditor = currrentEditor;
    if (editorRef.current && currrentEditor == null) {
      newEditor = monaco.editor.create(editorRef.current, {
        value: "",
        theme: "vs-dark",
        fontSize: 16,
        wordWrap: "on",
        wordWrapMinified: true,
        minimap: {
          enabled: false,
        },
        lineNumbers: "off",
      });
      newEditor.updateOptions({ tabSize: 2 });
      const rect = editorRef.current.getBoundingClientRect();
      newEditor.layout({ width: rect.width, height: rect.height });
      setCurrentEditor(newEditor);
    }

    if (currrentEditor) {
      if (currentFilepath) {
        const m = findModel(currentFilepath);
        if (m) {
          currrentEditor.setModel(m);
          const rect = editorRef.current.getBoundingClientRect();
          currrentEditor.layout({ width: rect.width, height: rect.height });
          currrentEditor.focus();
          return;
        }
      }
      currrentEditor.setModel(null);
      return;
    }
  }, [editorRef.current, currrentEditor, currentFilepath]);

  useEffect(() => {
    return () => {
      currrentEditor?.dispose();
    };
  }, []);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 5,
          bottom: 5,
          left: 5,
          right: 5,
        }}
      >
        <div
          ref={editorRef}
          style={{
            background: "#888",
            margin: 0,
            padding: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        />
      </div>
    </div>
  );
});
