import clone from "lodash-es/clone";
import immer from "immer";

export type Node<T> = {
  id: string;
  data: T;
  children: Array<Node<T>>;
};

export type Cursor = number[];

function genId() {
  return Date.now().toString() + "-" + Math.random().toString();
}

export function createNode<T>(data: T, children: Array<Node<T>> = []): Node<T> {
  return {
    id: genId(),
    data,
    children,
  };
}

export function setNodeWithCursor<T>(
  tree: Node<T>,
  node: Node<T>,
  cursor: Cursor
): Node<T> {
  if (cursor.length === 0) {
    return node;
  }
  return immer(tree, (newTree) => {
    let currentNode: any = newTree;
    const newCursor = clone(cursor);
    while (true) {
      const idx = newCursor.shift() as number;
      if (newCursor.length === 0) {
        // replace node and end
        currentNode.children[idx] = node;
        break;
      } else {
        // dig
        currentNode = currentNode.children[idx];
      }
    }
  });
}

export function appendNodeWithCursor<T>(
  tree: Node<T>,
  node: Node<T>,
  cursor: Cursor
): Node<T> {
  if (cursor.length === 0) {
    return node;
  }
  return immer(tree, (newTree) => {
    let currentNode: any = newTree;
    const newCursor = clone(cursor);
    while (true) {
      const idx = newCursor.shift() as number;
      if (newCursor.length === 0) {
        // replace node and end
        if (currentNode.children) {
          currentNode.children.splice(idx, 0, node);
        }
        break;
      } else {
        // dig
        currentNode.children && (currentNode = currentNode.children[idx]);
      }
    }
  });
}

export function walkWithMutation<T>(
  tree: Node<T>,
  visit: (node: Node<T>, parent: Node<T> | null, cursor: Array<number>) => void,
  parent: Node<T> | null = null,
  cursor: Array<number> = []
) {
  return immer(tree, (newTree) => {
    visit(newTree as any, parent, cursor);
    newTree.children &&
      newTree.children.map((child, index) => {
        return walkWithMutation(
          child as any,
          visit,
          parent,
          cursor.concat([index])
        );
      });
  });
}

export function findParentId<T>(
  tree: Node<T>,
  targetId: string,
  parentId: string | null = null
): string | null {
  if (tree.id === targetId) {
    return parentId;
  }
  if (tree.children) {
    for (const child of tree.children) {
      const hit = findParentId(child, targetId, tree.id);
      if (hit) {
        return hit;
      }
    }
  }
  return null;
}

export function appendNodeBefore<T>(
  tree: Node<T>,
  newNode: Node<T>,
  targetId: string
): Node<T> {
  const parentId = findParentId(tree, targetId);
  return walkWithMutation(tree, (node) => {
    if (parentId === node.id && node.children) {
      const index = node.children.findIndex((n) => n.id === targetId);
      if (index > -1) {
        node.children.splice(index, 0, newNode);
      }
    }
  });
}

export function removeNodeFromTree<T>(
  tree: Node<T>,
  targetId: string
): Node<T> {
  const parentId = findParentId(tree, targetId);
  return walkWithMutation(tree, (node) => {
    // remove from old tree
    if (parentId === node.id && node.children) {
      const index = node.children.findIndex((n) => n.id === targetId);
      if (index > -1) {
        node.children.splice(index, 1);
      }
    }
  });
}

// TOOD: Fix me
// export function moveNode<T>(
//   tree: Node<T>,
//   targetId: string,
//   newParentId: string,
//   newIndex?: number
// ) {
//   const targetNode = getNode(tree, targetId) as Node<T>;
//   const removedTree = removeNodeFromTree(tree, targetId);
//   const cursor = getCursor(removedTree, newParentId) as Cursor;

//   const idx =
//     newIndex == null
//       ? // last index
//         ((getNode(removedTree, newParentId) as Node<T>).children as Array<
//           Node<T>
//         >).length
//       : newIndex;
//   return appendNodeWithCursor(removedTree, targetNode, cursor.concat([idx]));
// }

export function appendNodeAfter<T>(
  tree: Node<T>,
  newNode: Node<T>,
  targetId: string
): Node<T> {
  const parentId = findParentId(tree, targetId);
  return walkWithMutation(tree, (node) => {
    if (parentId === node.id && node.children) {
      const index = node.children.findIndex((n) => n.id === targetId);
      if (index > -1) {
        node.children.splice(index + 1, 0, newNode);
      }
    }
  });
}

export function replaceNodeById<T>(
  tree: Node<T>,
  newNode: Node<T>,
  targetId: string
): Node<T> {
  const parentId = findParentId(tree, targetId);
  // swap root
  if (parentId == null) {
    return newNode;
  } else {
    return walkWithMutation(tree, (node) => {
      if (parentId === node.id && node.children) {
        const index = node.children.findIndex((n) => n.id === targetId);
        if (index > -1) {
          node.children[index] = newNode;
        }
      }
    });
  }
}

function getNode<T>(tree: Node<T>, targetId: string): Node<T> | null {
  if (tree.id === targetId) {
    return tree;
  }
  if (tree.children != null) {
    for (const child of tree.children) {
      const hit = getNode(child, targetId);
      if (hit) {
        return hit;
      }
    }
  }
  return null;
}
export function getCursor<T>(
  tree: Node<T>,
  targetId: string,
  cursor: Cursor = []
): Cursor | null {
  if (tree.id === targetId) {
    return cursor;
  }
  if (tree.children != null) {
    for (const child of tree.children) {
      const childIndex = tree.children.findIndex((n) => n.id === child.id);
      const hit = getCursor(child, targetId, cursor.concat([childIndex]));
      if (hit) {
        return hit;
      }
    }
  }
  return null;
}

export function swapNodes<T>(tree: Node<T>, aid: string, bid: string): Node<T> {
  const acur = getCursor(tree, aid) as Cursor;
  const bcur = getCursor(tree, bid) as Cursor;
  const a = getNode(tree, aid) as Node<T>;
  const b = getNode(tree, bid) as Node<T>;
  const newTree = clone(tree);
  const t0 = setNodeWithCursor(newTree, b, acur);
  return setNodeWithCursor(t0, a, bcur);
}
