import React, { useState } from "react";
import ReactDOM from "react-dom";
import Backend from "react-dnd-html5-backend";
import { useDrag, DndProvider, useDrop, DragObjectWithType } from "react-dnd";
import produce from "immer";

interface DragObject extends DragObjectWithType {
  type: string;
  id: string;
}

type DropResult = {
  at: number;
  delta: { x: number; y: number } | null;
};

function DraggableObject(props: { id: string; children: any }) {
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
  });
  return (
    <>
      <div
        style={
          {
            // visibility: data.isDragging ? "hidden" : "visible",
          }
        }
        ref={ref}
      >
        {props.children}
      </div>
    </>
  );
}

function GridLayer(props: { id: string; children: any }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr 1fr",
        gridTemplateAreas: `'a b c' 'd e f' 'g h i'`,
        gridGap: "10px",
      }}
    >
      {props.children}
    </div>
  );
}

function DropPane(props: {
  gridArea: string;
  children: any;
  onDrop: (dragItem: DragObject) => void;
}) {
  const [data, drop] = useDrop<DragObject, DropResult, { isOver: boolean }>({
    accept: "xxx",
    hover(item, monitor) {
      console.log("hover");
    },
    canDrop() {
      return true;
    },
    drop(dragItem, monitor) {
      // const delta = monitor.getDifferenceFromInitialOffset();
      props.onDrop(dragItem);
      // if (delta) {
      //   props.onDrop();
      // }
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
        gridArea: props.gridArea,
        width: "100%",
        height: "100%",
        background: "#eee",
      }}
    >
      {props.children}
    </div>
  );
}

function App() {
  const recipes = [
    { id: "red" },
    { id: "blue" },
    { id: "yellow" },
    { id: "black" },
    { id: "white" },
  ];
  const [items, setItems] = useState<
    Array<{ id: string; content: null | string }>
  >([
    { id: "a", content: null },
    { id: "b", content: null },
    { id: "c", content: null },
    { id: "d", content: null },
    { id: "e", content: null },
    { id: "f", content: null },
    { id: "g", content: null },
    { id: "h", content: null },
    { id: "i", content: null },
  ]);
  const [selectedId, setSelectedId] = useState<null | string>(null);

  const selectedPane = selectedId && items.find((i) => i.id === selectedId);
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body, main {padding: 0; margin: 0; width: 100vw; height: 100vh; }`,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ display: "flex", width: "100%", flex: 1 }}>
          <DndProvider backend={Backend}>
            <div style={{ display: "flex", width: "100%", height: "100%" }}>
              <div style={{ width: 300, height: "100%" }}>
                {recipes.map((r) => {
                  return (
                    <DraggableObject id={r.id} key={r.id}>
                      <div
                        style={{
                          backgroundColor: r.id,
                          borderBottom: "1px solid black",
                          display: "flex",
                          height: 64,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      />
                    </DraggableObject>
                  );
                })}
              </div>
              <div
                style={{
                  flex: 1,
                  height: "100%",
                  padding: 10,
                  boxSizing: "border-box",
                }}
              >
                <GridLayer id="bg">
                  {items.map((item) => {
                    return (
                      <DropPane
                        key={item.id}
                        gridArea={item.id}
                        onDrop={(dragItem) => {
                          const newItems = produce(items, (draft) => {
                            const hit = draft.findIndex(
                              (i) => i.id === item.id
                            );
                            if (hit > -1) {
                              draft[hit].content = dragItem.id;
                            }
                          });
                          setItems(newItems);
                        }}
                      >
                        <div
                          onClick={() => setSelectedId(item.id)}
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: item.content
                              ? item.content
                              : "gray",
                          }}
                        >
                          {item.id}: {item.content}
                        </div>
                      </DropPane>
                    );
                  })}
                </GridLayer>
              </div>
              <div style={{ width: 300, height: "100%" }}>
                {selectedPane && (
                  <div>
                    <div>id: {selectedPane.id}</div>
                    <div>content: {selectedPane.content || "null"}</div>
                  </div>
                )}
              </div>
            </div>
          </DndProvider>
        </div>

        <div style={{ display: "flex", width: "100%", height: "20%" }}>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            <code>{JSON.stringify(items, null)}</code>
          </pre>
        </div>
      </div>
    </>
  );
}

const main = document.createElement("main");
document.body.appendChild(main);
ReactDOM.render(<App />, main);
