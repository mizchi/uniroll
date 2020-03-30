import React, { useState, useCallback } from "react";
import {
  Flex,
  Heading,
  Textarea,
  Button,
  LightMode,
  Box
} from "@chakra-ui/core";
import { Files } from "../App";
import JSONEditor from "../editor/JSONEditor";

export function VariablesPane(props: {
  files: Files;
  onUpdate: (filepath: string, value: string) => void;
}) {
  const raw = props.files["/variables.json"];
  const parsedJson = JSON.parse(raw || "{}");
  const [isTextarea, setIsTextarea] = useState(false);
  const [currentRaw, setCurrentRaw] = useState(raw);
  const [validValue, setValidValue] = useState(parsedJson);

  const onChange = useCallback(
    (event: any) => {
      const value = event.target.value;
      setCurrentRaw(value);
      try {
        const json = JSON.parse(value);
        props.onUpdate("/variables.json", value);
        setValidValue(json);
      } catch (err) {
        // console
      }
    },
    [props.onUpdate]
  );
  return (
    <Flex
      direction="column"
      p={8}
      w="100%"
      maxW="100%"
      h="100%"
      maxH="100%"
      flexDirection="column"
    >
      <Flex h="32px" w="100%">
        <Button size="sm" onClick={() => setIsTextarea(s => !s)}>
          toggle
        </Button>
      </Flex>
      <Flex h="calc(100% - 32px)" w="100%">
        {isTextarea ? (
          <Textarea
            h="100%"
            w="100%"
            value={currentRaw}
            onChange={onChange}
          ></Textarea>
        ) : (
          <LightMode>
            <Box w="100%" h="100%" background="#eee">
              <JSONEditor
                value={validValue}
                onUpdate={value => {
                  console.log("json editor updated", value);
                  const newRaw = JSON.stringify(value, null, 2);
                  props.onUpdate("/variables.json", newRaw);
                  setCurrentRaw(newRaw);
                }}
              />
            </Box>
          </LightMode>
        )}
      </Flex>
    </Flex>
  );
}
