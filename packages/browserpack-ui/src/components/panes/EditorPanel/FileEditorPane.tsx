import { Suspense } from "react";
import React from "react";
import { Flex, Button, Text } from "@chakra-ui/core";
import path from "path";
const MonacoEditor = React.lazy(() => import("../../editor/MonacoEditor"));

const extToLang: { [key: string]: string } = {
  ".ts": "typescript",
  ".tsx": "typescript",
  ".js": "javascript",
  ".css": "css",
  ".json": "json"
};
export function FileEditorPane(props: {
  onBack: () => void;
  onUpdate: (filepath: string, value: string) => void;
  filepath: string;
  value: string;
}) {
  const lang = extToLang[path.extname(props.filepath || "")];
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
          <MonacoEditor
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
