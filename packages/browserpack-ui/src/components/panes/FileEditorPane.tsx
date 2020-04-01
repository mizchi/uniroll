import { Suspense } from "react";
import React from "react";
import { Flex, Button, Text } from "@chakra-ui/core";
import path from "path";
import { extToLanguage, Editor } from "../App";
export function FileEditorPane(props: {
  onBack: () => void;
  onUpdate: (filepath: string, value: string) => void;
  filepath: string;
  value: string;
}) {
  const lang = extToLanguage[path.extname(props.filepath || "")];
  return (
    <Flex h="100%" w="100%" direction="column">
      <Flex h="36px" w="100%">
        <Button size="sm" onClick={props.onBack}>
          &lt;
        </Button>
        <Text
          pl={3}
          alignItems="center"
          justifyContent="center"
          d="inline-flex"
          h="100%"
        >
          {props.filepath}
        </Text>
      </Flex>
      <Flex h="calc(100% - 36px)" w="100%">
        <Suspense fallback="..">
          <Editor
            key={props.filepath}
            value={props.value}
            language={lang as any}
            onChangeValue={value => props.onUpdate(props.filepath, value)}
          />
        </Suspense>
      </Flex>
    </Flex>
  );
}
