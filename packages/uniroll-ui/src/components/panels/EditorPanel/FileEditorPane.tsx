import { Suspense, useCallback } from "react";
import React from "react";
import { Flex, Button, Text } from "@chakra-ui/core";
import { useAppState } from "../../contexts";

let _cache: any = null;
const MonacoWorkspaceEditor = React.lazy(() => {
  if (_cache) {
    return _cache;
  }
  // _cache = import("../../../../../monaco-editor-react/MonacoWorkspaceEditor");
  _cache = import("monaco-workspace-editor-react/lib/index");
  return _cache;
});

export function FileEditorPane() {
  const {
    currentFilepath,
    files,
    onSelectFilepath,
    onSetFiles,
  } = useAppState();
  const onBack = useCallback(() => {
    onSelectFilepath(null);
  }, []);
  return (
    <Flex h="100%" w="100%" direction="column">
      <Flex h="36px" w="100%">
        <Button size="sm" onClick={onBack}>
          &lt;
        </Button>
        <Text
          pl={3}
          alignItems="center"
          justifyContent="center"
          d="inline-flex"
          h="100%"
        >
          {currentFilepath}
        </Text>
      </Flex>
      <Flex h="calc(100% - 36px)" w="100%">
        <Suspense fallback="..">
          <MonacoWorkspaceEditor
            currentFilepath={currentFilepath}
            initialFiles={files}
            onChangeFiles={onSetFiles}
          />
        </Suspense>
      </Flex>
    </Flex>
  );
}
