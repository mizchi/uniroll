import React, { useEffect, useState } from "react";
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
import styled from "@emotion/styled";

export function FileSelectorPane(props: {
  files: Files;
  onSelectFilepath: (filepath: string) => void;
}) {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const w = window.innerWidth;
    const onResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Flex direction="column">
      <Flex>
        {width > 768 ? (
          <Box>
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
        ) : (
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
        )}
      </Flex>
      <Flex></Flex>
    </Flex>
  );
}
