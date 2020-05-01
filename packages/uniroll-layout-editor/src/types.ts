import type { Node as TreeNode } from "./tree-api";

export interface NodeBase {
  elementType: string;
  attrs: { [k: string]: any };
}

export interface RootNode extends NodeBase {
  elementType: "root";
}

type GridAttrs = {
  rows: Array<string>;
  columns: Array<string>;
  areas: string[][];
};
export interface GridNode extends NodeBase {
  elementType: "grid";
  attrs: GridAttrs;
}

type FlexAttrs = {
  direction: "column" | "row";
};
export interface FlexNode extends NodeBase {
  elementType: "flex";
  attrs: FlexAttrs;
}

export type GridAreaAttrs = {
  gridArea: string;
};
export interface GridAreaNode extends NodeBase {
  elementType: "grid-area";
  attrs: GridAreaAttrs;
}

type TextAttrs = {
  value: string;
};
export interface TextNode extends NodeBase {
  elementType: "text";
  attrs: TextAttrs;
}

type ImageAttrs = {
  src: string;
};
export interface ImageNode extends NodeBase {
  elementType: "image";
  attrs: ImageAttrs;
}

export type WysiwygAttrs = {
  data: any;
};
export interface WysiwygNode extends NodeBase {
  elementType: "wysiwyg";
  attrs: WysiwygAttrs;
}

type CodeAttrs = {
  name: string;
  files: { [k: string]: string };
};
export interface CodeNode extends NodeBase {
  elementType: "code";
  attrs: CodeAttrs;
}

export type ElementData =
  | RootNode
  | GridNode
  | GridAreaNode
  | FlexNode
  | TextNode
  | ImageNode
  | WysiwygNode
  | CodeNode;

export type ElementTree = TreeNode<ElementData>;

export type ElementSource =
  | {
      displayName: string;
      sourceType: "text";
      attrs: TextAttrs;
    }
  | {
      displayName: string;
      sourceType: "image";
      attrs: ImageAttrs;
    }
  | {
      displayName: string;
      sourceType: "grid";
      attrs: GridAttrs;
    }
  | {
      displayName: string;
      sourceType: "flex";
      attrs: FlexAttrs;
    }
  | {
      displayName: string;
      sourceType: "wysiwyg";
      attrs: WysiwygAttrs;
    }
  | {
      displayName: string;
      sourceType: "code";
      attrs: CodeNode;
    };

export type DragType = SourceDragType | ElementDragType;
export type SourceDragType = {
  dragType: "source";
  source: ElementSource;
};

export type ElementDragType = {
  dragType: "element";
  id: string;
};

export type DropType =
  | {
      dropType: "blank";
      parentId: string;
    }
  | {
      id: string;
      dropType: "existed-element";
    };

// TODO: Extract as domain data
export function isLayoutElement(
  elementType: ElementData["elementType"]
): boolean {
  return ["grid", "flex", "grid-area", "root"].includes(elementType);
}

export function isNodeElement(
  elementType: ElementData["elementType"]
): boolean {
  return !isLayoutElement(elementType);
}

export type Props = {
  initialTree: ElementTree;
  sources: ElementSource[];
  onChange: (state: ElementTree) => void;
};
