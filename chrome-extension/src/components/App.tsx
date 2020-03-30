import {
  Button,
  ButtonGroup,
  CSSReset,
  DarkMode,
  Flex,
  ThemeProvider
} from "@chakra-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { templateList } from "../constants";
import { FileEditorPane } from "./panes/FileEditorPane";
import { FileSelectorPane } from "./panes/FileSelectorPane";
import { RunnerPane } from "./panes/RunnerPane";
import { TemplatesPane } from "./panes/TemplatesPane";
import { VariablesPane } from "./panes/VariablesPane";

export type Files = { [key: string]: string };
export const Editor = React.lazy(() => import("./editor/Editor"));
export const extToLanguage: { [key: string]: string } = {
  ".ts": "typescript",
  ".tsx": "typescript",
  ".js": "javascript",
  ".css": "css"
};

export function App() {
  return (
    <DarkMode>
      <ThemeProvider>
        <CSSReset />
        <Internal />
      </ThemeProvider>
    </DarkMode>
  );
}

// const STORAGE_KEY = "$current";

type SavedState = {
  files: { [k: string]: string };
};

type SCENE = "editor" | "template" | "run" | "variables";
const firstFiles = templateList[0].files as any;
function Internal() {
  const [currentScene, setCurrentScene] = useState<SCENE>("editor");
  const [files, setFiles] = useState<Files>(firstFiles);
  const [currentFilepath, setCurrentFilepath] = useState<string | null>(null);
  useEffect(() => {
    chrome.storage.sync.get(["$current"], result => {
      const savedState = result.$current;
      if (savedState != null) {
        try {
          const data = JSON.parse(savedState) as SavedState;
          setFiles(data.files);
        } catch (err) {
          // throw err;
          alert(err.message);
        }
      }
    });
  }, []);

  const onUpdate = useCallback(
    (filepath: string, value: string) => {
      console.log("onupdate", filepath, value);
      const newFiles = { ...files, [filepath]: value };
      setFiles(newFiles);
      chrome.storage.sync.set({
        $current: JSON.stringify({ files: newFiles })
      });
    },
    [files]
  );

  const onSelectFile = useCallback((filepath: string) => {
    setCurrentFilepath(filepath);
  }, []);

  return (
    <>
      <Flex direction="column" w="100%" h="100%">
        <Flex h="32px">
          <Header
            onClickTab={scene => {
              setCurrentScene(scene);
              setCurrentFilepath(null);
            }}
          />
        </Flex>
        <Flex h="calc(100% - 32px)">
          {currentScene == "run" && <RunnerPane files={files} />}
          {currentScene == "editor" &&
            (currentFilepath ? (
              <FileEditorPane
                filepath={currentFilepath}
                value={files[currentFilepath]}
                onBack={() => setCurrentFilepath(null)}
                onUpdate={onUpdate}
              />
            ) : (
              <FileSelectorPane files={files} onSelectFilepath={onSelectFile} />
            ))}
          {currentScene === "variables" && (
            <VariablesPane files={files} onUpdate={onUpdate} />
          )}
          {currentScene == "template" && (
            <TemplatesPane
              onSelectTemplate={id => {
                const template = templateList.find(t => t.id === id);
                if (template) {
                  setFiles(template.files as any);
                  setCurrentFilepath(null);
                  setCurrentScene("editor");
                }
              }}
            />
          )}
        </Flex>
      </Flex>
    </>
  );
}

function Header(props: { onClickTab: (scene: SCENE) => void }) {
  return (
    <ButtonGroup pt={1} pl={1}>
      <Button size="sm" onClick={() => props.onClickTab("run")}>
        Run
      </Button>
      <Button size="sm" onClick={() => props.onClickTab("editor")}>
        Files
      </Button>
      <Button size="sm" onClick={() => props.onClickTab("variables")}>
        Variables
      </Button>
      <Button size="sm" onClick={() => props.onClickTab("template")}>
        Templates
      </Button>
    </ButtonGroup>
  );
}
