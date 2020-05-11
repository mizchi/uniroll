import "./initMonaco";
import * as monaco from "monaco-editor";

import React, { useRef, useState, useEffect } from "react";
import { restoreFromJSON, disposeAll, readModel } from "./monacoFs";
// import { useAppState } from "../uniroll-ui/src/components/contexts";

type Props = {
  currentFilepath: string;
  initialFiles: { [k: string]: string };
  padding?: number;
  onChangeFiles: (files: { [k: string]: string }) => void;
};

const viewStateCache = new Map();

export default React.memo(
  ({ initialFiles, currentFilepath, onChangeFiles, padding = 5 }: Props) => {
    // const { files: initialFiles, currentFilepath, onSetFiles } = useAppState();
    useEffect(() => {
      // console.log("remount");
      viewStateCache.clear();
      restoreFromJSON(initialFiles);
      // debugger;
    }, []);

    const [files, setFiles] = useState(initialFiles);

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
          onChangeFiles(newFiles);
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
            top: padding,
            bottom: padding,
            left: padding,
            right: padding,
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
  }
);
