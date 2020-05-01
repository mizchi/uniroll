// import { DraggableTree } from "../../src";
// import * as treeUtils from "@mizchi/tree-utils/inverted";

import React from "react";
import ReactDOM from "react-dom";
import Backend from "react-dnd-html5-backend";
import {
  useDrag,
  DndProvider,
  useDragLayer,
  useDrop,
  DropTargetMonitor,
  DragObjectWithType,
} from "react-dnd";

interface DragObject extends DragObjectWithType {
  type: string;
  id: string;
}

type DropResult = {
  at: number;
};

function DraggableObject(props: { id: string }) {
  const [data, ref] = useDrag<DragObject, DragObject, { isDragging: boolean }>({
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
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <div
      style={{
        display: "inline-flex",
        background: data.isDragging ? "wheat" : "gray",
        width: 100,
        height: 100,
        outline: "1px solid black",
      }}
      ref={ref}
    >
      Item {props.id}
    </div>
  );
}

function DropLayerObject(props: { id: string }) {
  const [data, drop] = useDrop<DragObject, DropResult, { isOver: boolean }>({
    accept: "xxx",
    canDrop() {
      return true;
    },
    drop(item, monitor) {
      console.log("dropped", item);
      return { at: Date.now() };
    },
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
      };
    },
  });
  return (
    <div
      ref={drop}
      style={{
        background: data.isOver ? "green" : "teal",
        height: "50vw",
        outline: "1px solid black",
        flex: 1,
      }}
    >
      Drop layer: {props.id}
    </div>
  );
}

function App() {
  return (
    <div style={{ width: "100vw" }}>
      <DndProvider backend={Backend}>
        <div style={{ display: "flex" }}>
          <DraggableObject id="1" />
          <DraggableObject id="2" />
        </div>
        <div
          style={{ display: "flex", width: "100%", outline: "1px solid black" }}
        >
          <DropLayerObject id="3" />
          <DropLayerObject id="4" />
        </div>
      </DndProvider>
    </div>
  );
}

const main = document.createElement("main");
document.body.appendChild(main);
ReactDOM.render(<App />, main);
