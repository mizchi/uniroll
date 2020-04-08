import {
  Button,
  ButtonGroup,
  CSSReset,
  DarkMode,
  Flex,
  ThemeProvider,
} from "@chakra-ui/core";
import React, { useCallback, useEffect, useState, useContext } from "react";
import { templateList } from "./constants";
import {
  useEnv,
  IsInMobileContext,
  useAppState,
  AppStateContext,
} from "./contexts";
import { useWindowWidth } from "./hooks";

export type Files = { [key: string]: string };
// export const Editor = React.lazy(() => import("./editor/Editor"));
export const extToLanguage: { [key: string]: string } = {
  ".ts": "typescript",
  ".tsx": "typescript",
  ".js": "javascript",
  ".css": "css",
};

export function App() {
  const width = useWindowWidth();
  return (
    <IsInMobileContext.Provider value={width < 768}>
      <DarkMode>
        <ThemeProvider>
          <CSSReset />
          <AppContainer />
        </ThemeProvider>
      </DarkMode>
    </IsInMobileContext.Provider>
  );
}

const firstFiles = templateList[0].files as any;

function AppContainer() {
  const env = useEnv();
  const [scene, onSelectScene] = useState<string>("editor");
  const [files, onSetFiles] = useState<Files>(firstFiles);
  const [currentFilepath, setCurrentFilepath] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const data = await env.load();
        onSetFiles(data.files);
      } catch (err) {
        alert(err.message);
      }
    })();
  }, []);

  const onUpdateFile = useCallback(
    (filepath: string, value: string) => {
      const newFiles = { ...files, [filepath]: value };
      onSetFiles(newFiles);
      env.save({
        files: newFiles,
      });
    },
    [files]
  );

  const onSelectFilepath = useCallback((filepath: string) => {
    setCurrentFilepath(filepath);
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        scene,
        files,
        currentFilepath,
        onSetFiles,
        onSelectFilepath,
        onUpdateFile,
        onSelectScene,
      }}
    >
      <AppLayout />
    </AppStateContext.Provider>
  );
}

function AppLayout() {
  const { layout } = useEnv();
  const { scene } = useAppState();
  const selected = [...layout.leftTabs, ...layout.rightTabs].find(
    (t) => t.id === scene
  );
  return (
    <>
      <Flex direction="column" w="100%" h="100%">
        <Flex h="32px">
          <Header />
        </Flex>
        <Flex h="calc(100% - 32px)">{selected && <selected.component />}</Flex>
      </Flex>
    </>
  );
}

function Header() {
  const { layout } = useEnv();
  const { onSelectScene } = useAppState();
  return (
    <Flex w="100%">
      <Flex>
        <ButtonGroup pt={1} pl={1}>
          {layout.leftTabs.map((tab) => {
            return (
              <Button size="sm" onClick={() => onSelectScene(tab.id)}>
                {tab.displayName}
              </Button>
            );
          })}
        </ButtonGroup>
      </Flex>
      <Flex flex={1} />
      <Flex pr={1}>
        <ButtonGroup pt={1} pl={1}>
          {layout.rightTabs.map((tab) => {
            return (
              <Button size="sm" onClick={() => onSelectScene(tab.id)}>
                {tab.displayName}
              </Button>
            );
          })}
        </ButtonGroup>
      </Flex>
    </Flex>
  );
}
