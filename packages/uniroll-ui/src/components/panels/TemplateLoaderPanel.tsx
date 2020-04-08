import { Button, Flex, Heading, List, ListItem, Text } from "@chakra-ui/core";
import path from "path";
import React, { useEffect, useState } from "react";
import { useAppState, useEnv } from "../contexts";
import { TemplateDef } from "../editor/variables";
import { buildDefaultAssigns } from "../editor/VariablesEditor";

export function TemplatesPane() {
  const { onSelectScene, onSetFiles, onSelectFilepath } = useAppState();

  const {
    templateHost = "https://raw.githubusercontent.com/mizchi/uniroll/master/templates/gen/",
  } = useEnv();
  const [templateDefs, setTemplateDefs] = useState<
    Array<{ name: string; description?: string; dependencies?: object }>
  >([]);
  useEffect(() => {
    (async () => {
      const res = await fetch(path.join(templateHost, "list.json"));
      const list = await res.json();
      console.log(list);
      setTemplateDefs(list);
    })();
  }, []);
  return (
    <Flex direction="column" p={8}>
      <Heading>Template</Heading>
      <List>
        {templateDefs.map((pkg) => {
          return (
            <ListItem key={pkg.name} pt={3}>
              <Flex display="inline-flex">
                <Button
                  size="sm"
                  onClick={async () => {
                    const url = path.join(templateHost, pkg.name + ".json");
                    const res = await fetch(url);
                    const data = (await res.json()) as TemplateDef;
                    const assigns = buildDefaultAssigns(data.requiredProps);
                    const newFiles = {
                      ...data.files,
                      "/variables.json": JSON.stringify(assigns, null, 2),
                    };
                    onSetFiles(newFiles);
                    if (newFiles["/variables.json"]) {
                      onSelectFilepath(null);
                      onSelectScene("variables");
                    } else {
                      onSelectScene("editor");
                    }
                  }}
                >
                  load
                </Button>
                <Text fontSize="xl">{`${pkg.name}`}</Text>
              </Flex>
            </ListItem>
          );
        })}
      </List>
    </Flex>
  );
}
