import {
  Button,
  ButtonGroup,
  CSSReset,
  DarkMode,
  Flex,
  ThemeProvider
} from "@chakra-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { templateList } from "./constants";
import { FileEditorPane } from "./panes/EditorPanel/FileEditorPane";
import { FileSelectorPane } from "./panes/EditorPanel/FileSelectorPane";
import { RunnerPane } from "./panes/RunnerPane";
import { TemplatesPane } from "./panes/TemplatesPane";
import { VariablesPane } from "./panes/VariablesPane";
import { useEnv, IsInMobileContext } from "./contexts";
import { useWindowWidth } from "./hooks";
import { EditorPanel } from "./panes/EditorPanel";

export type Files = { [key: string]: string };
// export const Editor = React.lazy(() => import("./editor/Editor"));
export const extToLanguage: { [key: string]: string } = {
  ".ts": "typescript",
  ".tsx": "typescript",
  ".js": "javascript",
  ".css": "css"
};

export function App() {
  const width = useWindowWidth();
  return (
    <IsInMobileContext.Provider value={width < 768}>
      <DarkMode>
        <ThemeProvider>
          <CSSReset />
          <Internal />
        </ThemeProvider>
      </DarkMode>
    </IsInMobileContext.Provider>
  );
}
type SCENE = "editor" | "template" | "run" | "variables";
const firstFiles = templateList[0].files as any;
function Internal() {
  const env = useEnv();
  const [currentScene, setCurrentScene] = useState<SCENE>("editor");
  const [files, setFiles] = useState<Files>(firstFiles);
  const [currentFilepath, setCurrentFilepath] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const data = await env.load();
        setFiles(data.files);
      } catch (err) {
        alert(err.message);
      }
    })();
  }, []);

  const onUpdate = useCallback(
    (filepath: string, value: string) => {
      const newFiles = { ...files, [filepath]: value };
      setFiles(newFiles);
      env.save({
        files: newFiles
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
            files={files}
            onClickTab={scene => {
              setCurrentScene(scene);
              setCurrentFilepath(null);
            }}
          />
        </Flex>
        <Flex h="calc(100% - 32px)">
          {currentScene == "run" && <RunnerPane files={files} />}
          {currentScene === "variables" && (
            <VariablesPane files={files} onUpdate={onUpdate} />
          )}

          {currentScene == "editor" && (
            <EditorPanel
              filepath={currentFilepath}
              files={files}
              onBack={() => setCurrentFilepath(null)}
              onUpdate={onUpdate}
              onSelectFile={onSelectFile}
            />
          )}
          {currentScene == "template" && (
            <TemplatesPane
              onSelectTemplate={async url => {
                const res = await fetch(url);
                const data = await res.json();
                setFiles(data.files);
                if (data.files["/variables.json"]) {
                  setCurrentFilepath(null);
                  setCurrentScene("variables");
                } else {
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

function Header(props: { files: Files; onClickTab: (scene: SCENE) => void }) {
  return (
    <Flex w="100%">
      <Flex>
        <ButtonGroup pt={1} pl={1}>
          <Button size="sm" onClick={() => props.onClickTab("run")}>
            Run
          </Button>
          {props.files["/variables.json"] && (
            <Button size="sm" onClick={() => props.onClickTab("variables")}>
              Variables
            </Button>
          )}
          <Button size="sm" onClick={() => props.onClickTab("editor")}>
            Files
          </Button>
        </ButtonGroup>
      </Flex>
      <Flex flex={1} />
      <Flex pr={1}>
        <ButtonGroup pt={1} pl={1}>
          <Button size="sm" onClick={() => props.onClickTab("template")}>
            Templates
          </Button>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
}
