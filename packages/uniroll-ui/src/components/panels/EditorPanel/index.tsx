import { Flex } from "@chakra-ui/core";
import { useIsInMobile, useAppState } from "../../contexts";
import { FileEditorPane } from "./FileEditorPane";
import { FileSelectorPane } from "./FileSelectorPane";
import React, { useCallback } from "react";

export function EditorPanel() {
  const { currentFilepath } = useAppState();

  const isInMobile = useIsInMobile();
  if (isInMobile) {
    return currentFilepath ? <FileEditorPane /> : <FileSelectorPane />;
  } else {
    return (
      <Flex w="100%" h="100%">
        <Flex maxW="400px" h="100%" pl={3} pt={3}>
          <FileSelectorPane />
        </Flex>
        <Flex flex={1} w="100%" h="100%">
          <FileEditorPane />
        </Flex>
      </Flex>
    );
  }
}
