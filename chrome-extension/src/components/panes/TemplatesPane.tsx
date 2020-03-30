import React from "react";
import { Text, Flex, Button, ListItem, List, Heading } from "@chakra-ui/core";
import { templateList } from "../../constants";
export function TemplatesPane(props: {
  onSelectTemplate: (id: string) => void;
}) {
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
