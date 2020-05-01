import { Pane, Text } from "./elements";
// import { sources } from "../mock";
import { useDragOnTree } from "../contexts/dnd";
import { ElementSource } from "../types";
import React, { useContext } from "react";
import { PropsContext } from "../contexts/props";

export function SourceList() {
  const { sources } = useContext(PropsContext);
  return (
    <Pane>
      {sources.map((source, index) => {
        return <DraggableElementSourceItem key={index} source={source} />;
      })}
    </Pane>
  );
}

function DraggableElementSourceItem(props: { source: ElementSource }) {
  const [, ref] = useDragOnTree({
    dragType: "source",
    source: props.source,
  });
  return (
    <Pane ref={ref} paddingTop={5} height={32} outline="1px solid black">
      <Text>{props.source.displayName}</Text>
    </Pane>
  );
}
