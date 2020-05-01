import React, { useState } from "react";
import ReactDOM from "react-dom";
import Backend from "react-dnd-html5-backend";
import { useDrag, DndProvider, useDrop, DragObjectWithType } from "react-dnd";

interface DragObject extends DragObjectWithType {
  type: string;
  id: string;
}

type DropResult = {
  at: number;
  delta: { x: number; y: number } | null;
};

function DraggableObject(props: {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
}) {
  const [data, ref, preview] = useDrag<
    DragObject,
    DragObject,
    { isDragging: boolean }
  >({
    begin(monitor) {
      console.log("drag begin", monitor.isDragging());
    },
    end(dropResult, monitor) {},
    // previewOptions: {},
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
    previewOptions: {},
    // options: {
    //   dropEffect: "move",
    // },
  });
  return (
    <>
      {/* <DragPreviewImage connect={preview} src={knightImage} /> */}
      <div
        style={{
          position: "absolute",
          background: "green",
          // background: data.isDragging ? "wheat" : "gray",
          visibility: data.isDragging ? "hidden" : "visible",
          left: props.x,
          opacity: 1,
          top: props.y,
          width: props.width,
          height: props.height,
          // outline: "1px solid black",
        }}
        ref={ref}
      >
        Item {props.id}
      </div>
    </>
  );
}

function DropLayer(props: {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  onDrop: (id: string, delta: { x: number; y: number }) => void;

  children: any;
}) {
  const [data, drop] = useDrop<DragObject, DropResult, { isOver: boolean }>({
    accept: "xxx",
    canDrop() {
      return true;
    },
    drop(item, monitor) {
      // console.log("dropped", item);
      // debugger;
      console.log("offset", monitor.getClientOffset());
      console.log("diff", monitor.getDifferenceFromInitialOffset());
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        props.onDrop(item.id, delta);
      }

      return {
        at: Date.now(),
        delta: monitor.getDifferenceFromInitialOffset(),
      };
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
        position: "absolute",
        left: props.x,
        top: props.y,
        width: props.width,
        height: props.height,
        background: "#eee",
      }}
    >
      {props.children}
    </div>
  );
}

function App() {
  const [items, setItems] = useState([
    { x: 10, y: 10, id: "1" },
    { x: 100, y: 100, id: "2" },
  ]);
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body, main {padding: 0; margin: 0; width: 100vw; height: 100vh; }`,
        }}
      />
      <DndProvider backend={Backend}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            background: "#888",
          }}
        >
          <DropLayer
            id="bg"
            x={10}
            y={10}
            width={500}
            height={500}
            onDrop={(id, delta) => {
              console.log("delta");
              const newItems = items.map((i) => {
                if (i.id === id) {
                  return {
                    ...i,
                    x: i.x + delta.x,
                    y: i.y + delta.y,
                  };
                }
                return i;
              });
              setItems(newItems);
            }}
          >
            {items.map((item) => {
              return (
                <DraggableObject
                  key={item.id}
                  id={item.id}
                  x={item.x}
                  y={item.y}
                  width={100}
                  height={100}
                />
              );
            })}
          </DropLayer>
        </div>
      </DndProvider>
    </>
  );
}

const main = document.createElement("main");
document.body.appendChild(main);
ReactDOM.render(<App />, main);
