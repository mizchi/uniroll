import React, { useEffect, useState } from "react";
import { Text, Flex, Button, ListItem, List, Heading } from "@chakra-ui/core";
import { templateList } from "../../constants";
import path from "path";

const HOST =
  "https://raw.githubusercontent.com/mizchi/browserpack-v2/master/templates/gen";
export function TemplatesPane(props: {
  onSelectTemplate: (url: string) => any;
}) {
  const [templateDefs, setTemplateDefs] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      const res = await fetch(path.join(HOST, "list.json"));
      const list = (await res.json()) as string[];
      setTemplateDefs(list.map((r: string) => path.join(HOST, `${r}.json`)));
    })();
  }, []);
  return (
    <Flex direction="column" p={8}>
      <Heading>Template</Heading>
      <List>
        {templateDefs.map(t => {
          return (
            <ListItem key={t} pt={3}>
              <Flex display="inline-flex">
                <Text fontSize="xl">{t}</Text>
                <Button size="sm" onClick={() => props.onSelectTemplate(t)}>
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
