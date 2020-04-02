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
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [logs, setLogs] = useState<
    Array<{ type: "normal" | "error"; message: string }>
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
            { type: "error", message: `Compile Error: ${err.message}` }
          ])
        );
      }
    })();
  }, [props.files, builtCode]);

  const onClickRun = useCallback(async () => {
    let parsedJson: any = {};
    try {
      const variablesRaw = props.files["/variables.json"];
      parsedJson = JSON.parse(variablesRaw);
    } catch (err) {}
    if (builtCode) {
      try {
        setLogs(s =>
          s.concat([
            {
              type: "normal",
              message: `Start evaluating`
            }
          ])
        );
        if (env.inExtension && env.evalCodeInActiveTab) {
          env.evalCodeInActiveTab(builtCode, {
            inExtension: true,
            variables: parsedJson
          });
        } else {
          setPreviewCode(
            iframeTemplate(builtCode, {
              inExtension: false,
              variables: parsedJson
            })
          );
        }
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
            { type: "error", message: `Running Error: ${err.message}` }
          ])
        );
      }
    }
  }, [props.files, builtCode]);

  return (
    <Flex p={8} w="100%">
      <Flex direction="column" minW="50%" maxW="50%">
        <Heading>Run</Heading>
        <Stack spacing={2} pt={5}>
          {logs.map((log, index) => {
            return (
              <Text key={index} color={log.type === "error" ? "red" : ""}>
                {log.message}
              </Text>
            );
          })}
        </Stack>
        <ButtonGroup>
          <Button onClick={onClickRun}>Run</Button>
        </ButtonGroup>
      </Flex>
      {previewCode && (
        <Flex flex={1}>
          <IframePreviewPane value={previewCode} />
        </Flex>
      )}
    </Flex>
  );
}

function IframePreviewPane(props: { value: string }) {
  const ref = React.useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (ref.current) {
      const blob = new Blob([props.value], { type: "text/html" });
      ref.current.src = URL.createObjectURL(blob);
    }
  }, [ref.current, props.value]);
  return (
    <iframe
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        border: "none",
        background: "#eee"
      }}
      ref={ref}
    ></iframe>
  );
}

const iframeTemplate = (code: string, json: any = {}) => {
  const encoded = btoa(code);
  const url = `data:text/javascript;base64,${encoded}`;
  return `
<html>
<head></head>
<body>
  <main></main>
  <script type="module">
    import('${url}')
    .then(module => {
      if (module.default) {
        module.default(${JSON.stringify(json)});
      }
    })
    .catch((err) => {
      error(err.message)
    });
  </script>
</body>
</html>  
`;
};
