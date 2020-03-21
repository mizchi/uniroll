import { Suspense, useState } from "react";
import React from "react";
// import { ThemeProvider } from "@chakra-ui/core";
import {
  ThemeProvider,
  CSSReset,
  Flex,
  Button,
  DarkMode
} from "@chakra-ui/core";

const Editor = React.lazy(() => import("./Editor"));

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

// import "./components/__pre";
// import "./api/__monaco";

import { compile } from "browserpack";

function Internal() {
  const [state, setState] = useState("");

  return (
    <>
      <Flex direction="column" w="100%" h="100%">
        <Flex h="32px">
          <Button
            size="sm"
            onClick={async () => {
              const bundle = await compile({
                useInMemory: true,
                files: {
                  "/index.tsx": state
                },
                input: "/index.tsx"
              });
              const out = await bundle.generate({ format: "esm" });
              const code = out.output[0].code;

              chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                var activeTab = tabs[0];
                var activeTabId = activeTab.id; // or do whatever you need
                chrome.tabs.executeScript(activeTabId as number, {
                  code
                });
              });
            }}
          >
            Run
          </Button>
        </Flex>
        <Flex h="calc(100% - 32px)">
          <Suspense fallback="..">
            <Editor
              value={state}
              onChangeValue={value => {
                setState(value);
              }}
            />
          </Suspense>
        </Flex>
      </Flex>
    </>
  );
}
