// import { DraggableTree } from "../../src";
// import * as treeUtils from "@mizchi/tree-utils/inverted";

import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import Backend from "react-dnd-html5-backend";
import {
  useDrag,
  DndProvider,
  useDrop,
  DragObjectWithType,
  DropTarget,
} from "react-dnd";

interface DragObject extends DragObjectWithType {
  type: string;
  id: string;
}

type DropResult = {
  at: number;
};

function DraggableObject(props: {
  id: string;
  onDrop: (result: { from: string; to: string }) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [data, dragRef] = useDrag<
    DragObject,
    DragObject,
    { isDragging: boolean }
  >({
    begin() {
      console.log("drag begin");
    },
    end(dropResult, monitor) {
      console.log("[draggable] drop end", dropResult, monitor);
    },
    canDrag() {
      return true;
    },
    item: {
      type: "xxx",
      id: props.id,
    },
    collect(monitor) {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  const [dropData, dropRef] = useDrop<
    DragObject,
    DropResult,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: "xxx",
    canDrop(dragItem: DragObject) {
      return dragItem.id !== props.id;
    },
    drop(dragItem, monitor) {
      // console.log("dropped", item);
      props.onDrop({ to: props.id, from: dragItem.id });
      return { at: Date.now() };
    },
    collect(monitor) {
      return {
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      };
    },
  });
  dragRef(dropRef(ref));
  return (
    <div
      ref={ref}
      style={{
        display: "inline-flex",
        outline: dropData.canDrop ? "1px solid red" : "1px solid black",
        background: data.isDragging ? "wheat" : "gray",
        width: 100,
        height: 100,
      }}
    >
      Item {props.id}
    </div>
  );
}

function App() {
  const [items, setItems] = useState(["1", "2", "3", "4"]);
  return (
    <div style={{ width: "100vw" }}>
      <DndProvider backend={Backend}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {items.map((i) => {
            return (
              <DraggableObject
                id={i}
                key={i}
                onDrop={(result) => {
                  const fromId = items.find((id) => id === result.from)!;
                  const toId = items.find((id) => id === result.to)!;
                  const newItems = items.map((id) => {
                    if (id === result.from) {
                      return toId;
                    }
                    if (id === result.to) {
                      return fromId;
                    }
                    return id;
                  });
                  console.log("items", result);
                  setItems(newItems);
                }}
              />
            );
          })}
        </div>
      </DndProvider>
    </div>
  );
}

const main = document.createElement("main");
document.body.appendChild(main);
ReactDOM.render(<App />, main);
