import { Suspense, useState, useCallback } from "react";
import React from "react";
import {
  Text,
  ThemeProvider,
  CSSReset,
  Flex,
  Button,
  DarkMode,
  Divider,
  ButtonGroup,
  ListItem,
  List,
  Heading,
  Box,
  Stack,
  Textarea
} from "@chakra-ui/core";
import { evalCodeInActiveTab } from "../env/chromeApi";
import { compile } from "browserpack";
import path from "path";
import { templateList } from "../constants";
type Files = { [key: string]: string };
const Editor = React.lazy(() => import("./Editor"));
const extToLanguage: { [key: string]: string } = {
  ".ts": "typescript",
  ".tsx": "typescript",
  ".js": "javascript",
  ".css": "css"
};

export function App() {
  return (
    <DarkMode>
      <ThemeProvider>
        <CSSReset />
        <Internal />
      </ThemeProvider>
    </DarkMode>
  );
}

const firstFiles = templateList[0].files as any;
function Internal() {
  const [currentScene, setCurrentScene] = useState<
    "editor" | "template" | "run" | "variables"
  >("editor");

  const [files, setFiles] = useState<Files>(firstFiles);
  const [currentFilepath, setCurrentFilepath] = useState<string | null>(null);
  const [logs, setLogs] = useState<
    Array<{ type: "normal" | "alert"; message: string }>
  >([]);
  const onClickRun = useCallback(async () => {
    setCurrentScene("run");
    setLogs([]);

    let code;
    try {
      setLogs(s => s.concat([{ type: "normal", message: "Build start" }]));
      const bundle = await compile({
        useInMemory: true,
        files,
        input: "/index.tsx"
      });
      setLogs(s => s.concat([{ type: "normal", message: "Compiled" }]));
      const out = await bundle.generate({ format: "esm" });
      console.log(out.output[0].code);
      setLogs(s =>
        s.concat([
          {
            type: "normal",
            message: `Generate: ${out.output[0].code.length} bytes`
          }
        ])
      );
      code = out.output[0].code;
    } catch (err) {
      setLogs(s =>
        s.concat([{ type: "alert", message: `Compile Error: ${err.message}` }])
      );
    }

    if (code) {
      try {
        evalCodeInActiveTab(code, {});
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
  }, [files]);

  const onUpdate = useCallback(
    (value: string) => {
      if (currentFilepath) {
        const newFiles = { ...files, [currentFilepath]: value };
        setFiles(newFiles);
      }
    },
    [files, currentFilepath]
  );

  const onClickPreset = useCallback(() => {
    setCurrentScene("template");
  }, []);

  const onClickVariables = useCallback(() => {
    setCurrentScene("variables");
  }, []);

  const onSelectFile = useCallback((filepath: string) => {
    setCurrentFilepath(filepath);
  }, []);

  return (
    <>
      <Flex direction="column" w="100%" h="100%">
        <Flex h="32px">
          <ButtonGroup>
            <Button size="sm" onClick={onClickRun}>
              Run
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setCurrentScene("editor");
                setCurrentFilepath(null);
              }}
            >
              Files
            </Button>
            <Button size="sm" onClick={onClickVariables}>
              Variables
            </Button>
            <Button size="sm" onClick={onClickPreset}>
              Templates
            </Button>
          </ButtonGroup>
        </Flex>
        <Flex h="calc(100% - 32px)">
          {currentScene == "run" && <Runner logs={logs} />}
          {currentScene == "variables" && <Variables files={files} />}
          {currentScene == "editor" &&
            (currentFilepath ? (
              <FileEditor
                filepath={currentFilepath}
                value={files[currentFilepath]}
                onBack={() => setCurrentFilepath(null)}
                onUpdate={onUpdate}
              />
            ) : (
              <FileSelector files={files} onSelectFilepath={onSelectFile} />
            ))}
          {currentScene == "template" && (
            <TemplateSelector
              onSelectTemplate={id => {
                const template = templateList.find(t => t.id === id);
                if (template) {
                  setFiles(template.files as any);
                  setCurrentFilepath(null);
                  setCurrentScene("editor");
                }
              }}
            />
          )}
        </Flex>
      </Flex>
    </>
  );
}

function TemplateSelector(props: { onSelectTemplate: (id: string) => void }) {
  return (
    <Flex direction="column" p={8}>
      <Heading>Template</Heading>
      <List>
        {templateList.map(t => {
          return (
            <ListItem key={t.id} pt={3}>
              <Flex display="inline-flex">
                <Text fontSize="xl">{t.name}</Text>
                <Button size="sm" onClick={() => props.onSelectTemplate(t.id)}>
                  load
                </Button>
              </Flex>
            </ListItem>
          );
        })}
      </List>
    </Flex>
  );
}

function Runner(props: { logs: Array<{ type: any; message: string }> }) {
  return (
    <Flex direction="column" p={8}>
      <Heading>Run</Heading>
      <Stack spacing={2}>
        {props.logs.map((log, index) => {
          return (
            <Text key={index} color={log.type === "alert" ? "red" : ""}>
              {log.message}
            </Text>
          );
        })}
      </Stack>
    </Flex>
  );
}
function Variables(props: { files: Files }) {
  return (
    <Flex h="100%" w="100%" direction="column" pt={4} pl={8}>
      <Heading>Variables</Heading>
      <Textarea defaultValue={props.files["/varibles.json"] || "{}"}></Textarea>
    </Flex>
  );
}

function FileSelector(props: {
  files: Files;
  onSelectFilepath: (filepath: string) => void;
}) {
  return (
    <Flex direction="column">
      <Flex>
        <Box p={8}>
          <Heading>Files</Heading>
          <List>
            {Object.entries(props.files).map(([filepath, _value]) => {
              return (
                <ListItem key={filepath} pt={3}>
                  <Flex display="inline-flex">
                    <Text fontSize="xl">{filepath}</Text>
                    <Button
                      size="sm"
                      onClick={() => {
                        props.onSelectFilepath(filepath);
                      }}
                    >
                      edit
                    </Button>
                  </Flex>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Flex>
      <Flex></Flex>
    </Flex>
  );
}

function FileEditor(props: {
  onBack: () => void;
  onUpdate: (value: string) => void;
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
            onChangeValue={props.onUpdate}
          />
        </Suspense>
      </Flex>
    </Flex>
  );
}
