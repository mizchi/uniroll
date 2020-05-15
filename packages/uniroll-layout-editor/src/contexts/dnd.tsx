import { useDrag, useDrop, DragSourceMonitor } from "react-dnd";
import {
  ElementData,
  DragType,
  DropType,
  ElementTree,
  SourceDragType,
  GridNode,
} from "../types";
import { useTreeDispatch } from "./tree";
import { swapNodes, moveNode, addChild } from "../reducer";
import { ulid } from "ulid";
import { uniqueId, flatten } from "lodash-es";

export const DND_CONTEXT = "dnd-context";

type DragState = {
  isDragging: boolean;
};

type DropState = {
  canDrop: boolean;
  isOver: boolean;
};

export function useDragOnTree(dragType: DragType) {
  return useDrag<DragType & { type: typeof DND_CONTEXT }, void, DragState>({
    canDrag: () => {
      return true;
    },
    begin() {
      console.log("begin", dragType);
    },
    item: {
      type: DND_CONTEXT,
      ...dragType,
    },
    collect(monitor: DragSourceMonitor) {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });
}

export function useDropOnTree(drop: DropType) {
  const dispatch = useTreeDispatch();
  return useDrop<DragType & { type: typeof DND_CONTEXT }, any, DropState>({
    accept: DND_CONTEXT,
    canDrop: () => true,
    collect(monitor) {
      return {
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      };
    },
    drop(drag, _monitor) {
      console.log("[layout-drop]", drop);
      // console.log("drag", drag, ": drop to", drop);
      switch (drag.dragType) {
        case "source": {
          switch (drop.dropType) {
            case "blank": {
              const {
                data: childData,
                children,
              } = createElementDataBySourceType(drag);
              dispatch(
                addChild({ parentId: drop.parentId, data: childData, children })
              );
              return;
            }
            default: {
              return;
            }
          }
        }
        case "element": {
          switch (drop.dropType) {
            case "blank": {
              dispatch(
                moveNode({
                  targetId: drag.id,
                  newParentId: drop.parentId,
                })
              );
              return;
            }
            case "existed-element": {
              dispatch(swapNodes({ aid: drag.id, bid: drop.id }));
              return;
            }
            default: {
              return;
            }
          }
        }
      }
    },
  });
}

function createElementDataBySourceType(
  drag: SourceDragType
): {
  data: ElementData;
  children: ElementTree[];
} {
  switch (drag.source.sourceType) {
    case "text": {
      return {
        data: {
          elementType: "text",
          attrs: {
            value: ulid().slice(-5),
          },
        },
        children: [],
      };
    }

    case "image": {
      return {
        data: {
          elementType: "image",
          attrs: drag.source.attrs,
        },
        children: [],
      };
    }

    case "flex": {
      return {
        data: {
          elementType: "flex",
          attrs: drag.source.attrs,
        },
        children: [],
      };
    }
    case "wysiwyg": {
      return {
        data: {
          elementType: "wysiwyg",
          attrs: drag.source.attrs,
        },
        children: [],
      };
    }
    case "preact-component": {
      return {
        data: {
          elementType: "preact-component",
          attrs: drag.source.attrs,
        },
        children: [],
      };
    }

    case "grid": {
      const childData = {
        elementType: "grid",
        attrs: drag.source.attrs,
      } as GridNode;
      const children = flatten(drag.source.attrs.areas).map(
        (areaName: string) => {
          return {
            id: uniqueId() as string,
            data: {
              elementType: "grid-area",
              attrs: {
                gridArea: areaName,
              },
            },
            children: [],
          } as ElementTree;
        }
      );
      return { data: childData, children };
    }
    default: {
      // @ts-ignore
      throw new Error(`Unkown sourceType ${drag.source.sourceType}`);
    }
  }
}
