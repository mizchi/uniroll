import { toInvertedTree, InvertedTree } from "./tree-api/inverted";
import { reducerWithoutInitialState } from "typescript-fsa-reducers";
import { ElementData, ElementTree, GridAreaNode } from "./types";
import actionCreatorFactory from "typescript-fsa";
import * as invUtils from "./tree-api/inverted";
import * as treeUtils from "./tree-api";

// import { ulid } from "ulid";
import uniqueId from "lodash-es/uniqueId";

export enum TreeEditMode {
  ALL = "ALL",
  LAYOUT = "LAYOUT",
  ELEMENT = "ELEMENT",
  PREVIEW = "PREVIEW",
  OUTPUT = "OUTPUT",
}

export type TreeState = {
  tree: ElementTree;
  inv: InvertedTree<ElementData>;
  selectedId: string | null;
  editMode: TreeEditMode;
};

export const getInitialState = (tree: ElementTree): TreeState => {
  return {
    tree: tree,
    inv: toInvertedTree(tree),
    selectedId: null,
    // editMode: TreeEditMode.ELEMENT,
    editMode: TreeEditMode.LAYOUT,
  };
};

const actionCreator = actionCreatorFactory();

export const selectNode = actionCreator<string | null>("select-node");
export const selectEditMode = actionCreator<TreeEditMode>("select-edit-mode");

export const addChild = actionCreator<{
  parentId: string;
  data: ElementData;
  children?: ElementTree[];
}>("add-child");

export const swapNodes = actionCreator<{ aid: string; bid: string }>(
  "swap-nodes"
);

export const deleteNode = actionCreator<string>("delete-node");

export const moveNode = actionCreator<{
  targetId: string;
  newParentId: string;
  newIndex?: number;
}>("move-node");

export type TreeAction =
  | ReturnType<typeof selectNode>
  | ReturnType<typeof addChild>
  | ReturnType<typeof moveNode>
  | ReturnType<typeof deleteNode>
  | ReturnType<typeof swapNodes>;

export const reducer = reducerWithoutInitialState<TreeState>()
  .case(addChild, (state, payload) => {
    const newNode: ElementTree = {
      id: uniqueId(),
      data: payload.data,
      children: payload.children ?? [],
    };
    const newInv = invUtils.appendNode(state.inv, newNode, payload.parentId);
    return {
      ...state,
      inv: newInv,
      tree: invUtils.toNode(newInv),
    };
  })
  .case(swapNodes, (state, { aid, bid }) => {
    const newTree = treeUtils.swapNodes(state.tree, aid, bid);
    return {
      ...state,
      inv: toInvertedTree(newTree),
      tree: newTree,
    };
  })
  .case(moveNode, (state, { targetId, newParentId, newIndex }) => {
    const newInv = invUtils.moveNode(
      state.inv,
      targetId,
      newParentId,
      newIndex
    );
    return {
      ...state,
      inv: newInv,
      tree: invUtils.toNode(newInv),
    };
  })
  .case(deleteNode, (state, nodeId) => {
    const newInv = invUtils.removeNode(state.inv, nodeId);
    return {
      ...state,
      inv: newInv,
      tree: invUtils.toNode(newInv),
    };
  })
  // UI
  .case(selectEditMode, (state, payload) => {
    return {
      ...state,
      editMode: payload,
    };
  })
  .case(selectNode, (state, payload) => {
    return {
      ...state,
      selectedId: payload,
    };
  });
