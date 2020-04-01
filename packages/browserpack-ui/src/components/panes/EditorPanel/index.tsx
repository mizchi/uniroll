import { Flex } from "@chakra-ui/core";
import { useIsInMobile } from "../../contexts";
import { Files } from "../../../..";
import { FileEditorPane } from "./FileEditorPane";
import { FileSelectorPane } from "./FileSelectorPane";
import React from "react";

export function EditorPanel(props: {
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
