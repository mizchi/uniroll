import { useState, useCallback } from "react";
import React from "react";
import {
  ThemeProvider,
  CSSReset,
  Flex,
  Button,
  DarkMode,
  Divider,
  ButtonGroup
} from "@chakra-ui/core";
import { evalCodeInActiveTab } from "../env/chromeApi";
import { compile } from "browserpack";
import { templateList } from "../constants";
import { TemplatesPane } from "./panes/TemplatesPane";
import { RunnerPane } from "./panes/RunnerPane";
import { VariablesPane } from "./panes/VariablesPane";
import { FileSelectorPane } from "./panes/FileSelectorPane";
import { FileEditorPane } from "./panes/FileEditorPane";
import { isInExtension } from "../helper/isInExtension";

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

type SCENE = "editor" | "template" | "run" | "variables";
const firstFiles = templateList[0].files as any;
function Internal() {
  const [currentScene, setCurrentScene] = useState<SCENE>("editor");
  const [files, setFiles] = useState<Files>(firstFiles);
  const [currentFilepath, setCurrentFilepath] = useState<string | null>(null);
  const onUpdate = useCallback(
    (filepath: string, value: string) => {
      console.log("onupdate", filepath, value);
      const newFiles = { ...files, [filepath]: value };
      setFiles(newFiles);
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
