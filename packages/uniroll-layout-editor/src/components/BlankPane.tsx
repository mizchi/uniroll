import React from "react";
import { Flex, Text } from "./elements";
import { useDropOnTree } from "../contexts/dnd";

export function BlankPane(props: { parentId: string; text?: string }) {
  const [_data, ref] = useDropOnTree({
    dropType: "blank",
    parentId: props.parentId,
  });
  return (
    <Flex
      ref={ref}
      flex={1}
      padding={8}
      background="#888"
      border="1px dashed black"
    >
      <Text opacity={0.5}>{props.text ?? "DROP ME"}</Text>
    </Flex>
  );
}
