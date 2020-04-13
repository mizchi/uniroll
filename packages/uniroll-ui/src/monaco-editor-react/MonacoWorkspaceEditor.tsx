import "./initMonaco";
import * as monaco from "monaco-editor";

import React, { useRef, useState, useEffect } from "react";
import { restoreFromJSON, findModel, disposeAll, readModel } from "./monacoFs";
import { useAppState } from "../components/contexts";

const viewStateCache = new Map();
export default React.memo(() => {
  const { files: initialFiles, currentFilepath, onSetFiles } = useAppState();
  useEffect(() => {
    // console.log("remount");
    viewStateCache.clear();
    restoreFromJSON(initialFiles);
    // debugger;
  }, []);

  const [files, setFiles] = useState(initialFiles);
  // const [age, setAge] = useState(0);

  const editorRef = useRef<HTMLDivElement>(null as any);

  const [
    currentEditor,
    setCurrentEditor,
  ] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  // initialize once
  useEffect(() => {
    let newEditor = currentEditor;
    if (editorRef.current && currentEditor == null) {
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
      setCurrentEditor(newEditor);
    }
  }, [editorRef.current]);

  // reload file
  useEffect(() => {
    if (!currentEditor) {
      return;
    }
    if (currentFilepath) {
      const m = readModel(currentFilepath);
      currentEditor.setModel(m);

      if (viewStateCache.has(currentFilepath)) {
        currentEditor.restoreViewState(viewStateCache.get(currentFilepath));
      }

      const disposer = currentEditor.onDidChangeModelContent((changes) => {
        console.log("change", currentFilepath, currentEditor.getValue());
        const newFiles = {
          ...files,
          [currentFilepath]: currentEditor.getValue(),
        };
        setFiles(newFiles);
        onSetFiles(newFiles);
        viewStateCache.set(currentFilepath, currentEditor.saveViewState());
      });

      const rect = editorRef.current.getBoundingClientRect();
      currentEditor.layout({ width: rect.width, height: rect.height });
      currentEditor.focus();
      return () => {
        console.log("dispose onDidChange", currentFilepath);
        disposer.dispose();
      };
    } else {
      currentEditor.setModel(null);
    }
  }, [currentFilepath, currentEditor]);

  useEffect(() => {
    return () => {
      console.log("dispose all");
      viewStateCache.clear();
      currentEditor?.dispose();
      disposeAll();
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
