import React, { useEffect, useState } from "react";
import {
  Text,
  Flex,
  Button,
  ListItem,
  List,
  Heading,
  Box,
} from "@chakra-ui/core";
import { useAppState } from "../../contexts";

export function FileSelectorPane() {
  const { files, onSelectFilepath } = useAppState();

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
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
              {Object.entries(files).map(([filepath, _value]) => {
                return (
                  <ListItem key={filepath} pt={3}>
                    <Flex display="inline-flex">
                      <Text fontSize="xl">{filepath}</Text>
                      <Button
                        size="sm"
                        onClick={() => {
                          onSelectFilepath(filepath);
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
              {Object.entries(files).map(([filepath, _value]) => {
                return (
                  <ListItem key={filepath} pt={3}>
                    <Flex display="inline-flex">
                      <Text fontSize="xl">{filepath}</Text>
                      <Button
                        size="sm"
                        onClick={() => {
                          onSelectFilepath(filepath);
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
