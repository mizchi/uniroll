import { Suspense } from "react";
import React from "react";
import { Flex, Button } from "@chakra-ui/core";
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
      <Flex h="32px" w="100%">
        <Button size="sm" onClick={props.onBack}>
          &lt;
        </Button>
      </Flex>
      <Flex h="calc(100% - 32px)" w="100%">
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
