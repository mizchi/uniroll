import React, { useRef } from "react";
import { useDragOnTree, useDropOnTree } from "../contexts/dnd";
import { useTreeDispatch } from "../contexts/tree";
import { deleteNode, selectNode } from "../reducer";
import { ElementTree } from "../types";
import { BlankPane } from "./BlankPane";
import { EditableView } from "./EditableView";
import { Flex, Text } from "./elements";

export function EditableBox({
  tree,
  depth,
  children,
  headerText,
  showHeader = true,
}: {
  tree: ElementTree;
  depth: number;
  headerText?: string;
  children?: any;
  showHeader?: boolean;
}) {
  const dispatch = useTreeDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const [, dragRef] = useDragOnTree({
    dragType: "element",
    id: tree.id,
  });
  const [, dropRef] = useDropOnTree({
    dropType: "existed-element",
    id: tree.id,
  });
  dragRef(dropRef(ref));
  const isBlank = children == null && tree.children.length === 0;
  return (
    <Flex flexDirection="column" border="1px solid #ccc" background="#eee">
      {showHeader && (
        <Flex ref={ref} height="24px" fontSize={16}>
          <button
            onClick={() => {
              dispatch(selectNode(tree.id));
            }}
          >
            [i]
          </button>
          <Text>
            {headerText ?? `${tree.data.elementType}[${tree.id.slice(-4)}]`}
          </Text>
          <button
            style={{
              background: "red",
            }}
            onClick={() => {
              dispatch(deleteNode(tree.id));
            }}
          >
            [x]
          </button>
        </Flex>
      )}
      <Flex flex={1} paddingLeft={4} background="white">
        {isBlank && <BlankPane parentId={tree.id} />}
        {children ||
          tree.children.map((node) => {
            return <EditableView key={node.id} tree={node} depth={depth + 1} />;
          })}
      </Flex>
    </Flex>
  );
}
