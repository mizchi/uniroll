import React, { useEffect, useState } from "react";
import { Text, Flex, Button, ListItem, List, Heading } from "@chakra-ui/core";
import path from "path";
import { useEnv } from "../contexts";

export function TemplatesPane(props: {
  onSelectTemplate: (url: string) => any;
}) {
  const {
    templateHost = "https://raw.githubusercontent.com/mizchi/uniroll/master/templates/gen/"
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
        {templateDefs.map(pkg => {
          return (
            <ListItem key={pkg.name} pt={3}>
              <Flex display="inline-flex">
                <Button
                  size="sm"
                  onClick={() =>
                    props.onSelectTemplate(
                      path.join(templateHost, pkg.name + ".json")
                    )
                  }
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
