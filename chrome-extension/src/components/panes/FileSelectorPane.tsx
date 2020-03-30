import React from "react";
import {
  Text,
  Flex,
  Button,
  ListItem,
  List,
  Heading,
  Box
} from "@chakra-ui/core";
import { Files } from "../App";
export function FileSelectorPane(props: {
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
