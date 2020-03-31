import React, { useCallback, useState, useEffect } from "react";
import {
  Text,
  Flex,
  Heading,
  Stack,
  ButtonGroup,
  Button
} from "@chakra-ui/core";
import { useEnv } from "../contexts";
export function RunnerPane(props: { files: { [k: string]: string } }) {
  const env = useEnv();
  const [builtCode, setBuiltCode] = useState<string | null>(null);
  const [logs, setLogs] = useState<
    Array<{ type: "normal" | "alert"; message: string }>
  >([]);
  useEffect(() => {
    setLogs([]);
    (async () => {
      try {
        setLogs(s => s.concat([{ type: "normal", message: "Build start" }]));
        const bundle = await env.compile({
          useInMemory: true,
          files: props.files,
          input: "/index.tsx"
        });
        setLogs(s => s.concat([{ type: "normal", message: "Compiled" }]));
        const out = await bundle.generate({ format: "esm" });
        setLogs(s =>
          s.concat([
            {
              type: "normal",
              message: `Generate: ${out.output[0].code.length} bytes`
            }
          ])
        );
        const code = out.output[0].code;
        setBuiltCode(code as string);
      } catch (err) {
        setLogs(s =>
          s.concat([
            { type: "alert", message: `Compile Error: ${err.message}` }
          ])
        );
      }
    })();
  }, [props.files, builtCode]);

  const onClickRunInTab = useCallback(async () => {
    if (env.inExtension && builtCode) {
      try {
        setLogs(s =>
          s.concat([
            {
              type: "normal",
              message: `Start evaluating`
            }
          ])
        );
        // evalCodeInActiveTab(builtCode, {});
        setLogs(s =>
          s.concat([
            {
              type: "normal",
              message: `Done`
            }
          ])
        );
      } catch (err) {
        setLogs(s =>
          s.concat([
            { type: "alert", message: `Running Error: ${err.message}` }
          ])
        );
      }
    }
  }, [props.files, builtCode]);

  return (
    <Flex direction="column" p={8}>
      <Heading>Run</Heading>
      <Stack spacing={2} pt={5}>
        {logs.map((log, index) => {
          return (
            <Text key={index} color={log.type === "alert" ? "red" : ""}>
              {log.message}
            </Text>
          );
        })}
      </Stack>
      <ButtonGroup>
        <Button isDisabled={!env.inExtension} onClick={onClickRunInTab}>
          Run in Tab
        </Button>
      </ButtonGroup>
    </Flex>
  );
}
