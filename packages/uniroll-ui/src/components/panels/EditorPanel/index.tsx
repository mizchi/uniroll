import { Flex } from "@chakra-ui/core";
import { useIsInMobile, useAppState } from "../../contexts";
import { FileEditorPane } from "./FileEditorPane";
import { FileSelectorPane } from "./FileSelectorPane";
import React from "react";

export function EditorPanel() {
  const {
    scene,
    files,
    currentFilepath,
    onSelectScene,
    onUpdateFile,
    onSelectFilepath,
  } = useAppState();

  const isInMobile = useIsInMobile();
  if (isInMobile) {
    return currentFilepath ? (
      <FileEditorPane
        filepath={currentFilepath}
        value={files[currentFilepath]}
        onBack={() => onSelectFilepath(null)}
        onUpdate={onUpdateFile}
      />
    ) : (
      <FileSelectorPane files={files} onSelectFilepath={onSelectFilepath} />
    );
  } else {
    return (
      <Flex w="100%" h="100%">
        <Flex maxW="400px" h="100%" pl={3} pt={3}>
          <FileSelectorPane files={files} onSelectFilepath={onSelectFilepath} />
        </Flex>
        {currentFilepath && (
          <Flex flex={1} w="100%" h="100%">
            <FileEditorPane
              filepath={currentFilepath}
              value={files[currentFilepath]}
              onBack={() => onSelectFilepath(null)}
              onUpdate={onUpdateFile}
            />
          </Flex>
        )}
      </Flex>
    );
  }
}
