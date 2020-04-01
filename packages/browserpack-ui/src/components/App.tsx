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
import { FileEditorPane } from "./panes/FileEditorPane";
import { FileSelectorPane } from "./panes/FileSelectorPane";
import { RunnerPane } from "./panes/RunnerPane";
import { TemplatesPane } from "./panes/TemplatesPane";
import { VariablesPane } from "./panes/VariablesPane";
import { useEnv, IsInMobileContext } from "./contexts";
import { useWindowWidth } from "./hooks";

export type Files = { [key: string]: string };
export const Editor = React.lazy(() => import("./editor/Editor"));
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
            onClickTab={scene => {
              setCurrentScene(scene);
              setCurrentFilepath(null);
            }}
          />
        </Flex>
        <Flex h="calc(100% - 32px)">
          {currentScene == "run" && <RunnerPane files={files} />}
          {currentScene == "editor" && (
            <WrappedEditor
              filepath={currentFilepath}
              files={files}
              onBack={() => setCurrentFilepath(null)}
              onUpdate={onUpdate}
              onSelectFile={onSelectFile}
            />
          )}
          {currentScene === "variables" && (
            <VariablesPane files={files} onUpdate={onUpdate} />
          )}
          {currentScene == "template" && (
            <TemplatesPane
              onSelectTemplate={async url => {
                console.log("url");
                const res = await fetch(url);
                const data = await res.json();
                setFiles(data.files);
                setCurrentFilepath(null);
                setCurrentScene("variables");
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

import { useIsInMobile } from "./contexts";
function WrappedEditor(props: {
  filepath: string | null;
  files: Files;
  onBack: () => void;
  onSelectFile: (filepath: string) => void;
  onUpdate: (filepath: string, content: string) => void;
}) {
  const isInMobile = useIsInMobile();
  if (isInMobile) {
    return props.filepath ? (
      <FileEditorPane
        filepath={props.filepath}
        value={props.files[props.filepath]}
        onBack={props.onBack}
        onUpdate={props.onUpdate}
      />
    ) : (
      <FileSelectorPane
        files={props.files}
        onSelectFilepath={props.onSelectFile}
      />
    );
  } else {
    return (
      <Flex w="100%" h="100%">
        <Flex maxW="400px" h="100%" pl={3} pt={3}>
          <FileSelectorPane
            files={props.files}
            onSelectFilepath={props.onSelectFile}
          />
        </Flex>
        {props.filepath && (
          <Flex flex={1} w="100%" h="100%">
            <FileEditorPane
              filepath={props.filepath}
              value={props.files[props.filepath]}
              onBack={props.onBack}
              onUpdate={props.onUpdate}
            />
          </Flex>
        )}
      </Flex>
    );
  }
}
