import immer, { Draft } from "immer";

export type Node<T> = {
  id: string;
  data: T;
  children: Array<Node<T>>;
};

export type InvertedTree<T> = {
  childrenMap: {
    [id: string]: string[];
  };
  parentMap: {
    [id: string]: null | string;
  };
  dataMap: {
    [id: string]: T;
  };
};

export type NodeRef = {
  id: string;
  childrenIds: string[];
};

export function toInvertedTree<T>(root: Node<T>): InvertedTree<T> {
  const childrenMap: { [id: string]: string[] } = {};
  const parentMap: { [id: string]: string | null } = {};
  const dataMap: { [id: string]: T } = {};

  const walkWithParentId = (node: Node<T>, parentId: string | null = null) => {
    // @ts-ignore
    const childrenIds = node.children.map((child) => child.id);
    childrenMap[node.id] = childrenIds;
    dataMap[node.id] = node.data;
    parentMap[node.id] = parentId;

    node.children.forEach((child) => {
      walkWithParentId(child, node.id);
    });
  };
  walkWithParentId(root);

  return {
    childrenMap,
    parentMap,
    dataMap,
  };
}

export function toNode<T>(inv: InvertedTree<T>): Node<T> {
  // find root id
  let rootId: string | null = null;
  for (const key in inv.childrenMap) {
    const val = inv.parentMap[key];
    if (val == null) {
      rootId = key;
      break;
    }
  }

  return buildNodeFromInv(rootId as string);
  // recursive node building
  function buildNodeFromInv(id: string): Node<T> {
    const data = inv.dataMap[id];
    const children = inv.childrenMap[id].map((childId) => {
      return buildNodeFromInv(childId);
    });
    return {
      id,
      children,
      data,
    };
  }
}

export function removeNode<T>(inv: InvertedTree<T>, targetId: string) {
  return immer(inv, (newInv) => {
    function walk(targetId: string) {
      const children = newInv.childrenMap[targetId];
      children.forEach((cid) => walk(cid));

      delete newInv.parentMap[targetId];
      delete newInv.dataMap[targetId];
      delete newInv.childrenMap[targetId];
    }
    // remove children
    const children = newInv.childrenMap[targetId];
    children.forEach((cid) => walk(cid));

    // remove self from parent children
    const parentId = newInv.parentMap[targetId] as string;
    const parentChildrenIds = newInv.childrenMap[parentId];
    newInv.childrenMap[parentId] = parentChildrenIds.filter(
      (id) => id !== targetId
    );

    // remove self
    delete newInv.parentMap[targetId];
    delete newInv.dataMap[targetId];
    delete newInv.childrenMap[targetId];
  });
}

export function appendNode<T>(
  inv: InvertedTree<T>,
  newNode: Node<T>,
  appendingParentId: string,
  newIndex: number | null = null
) {
  return immer(inv, (newInv) => {
    const childrenIds = newInv.childrenMap[appendingParentId];
    if (newIndex != null) {
      childrenIds.splice(newIndex, 0, newNode.id);
    } else {
      childrenIds.push(newNode.id);
    }

    function walk(node: Node<T>, parentId: string) {
      newInv.childrenMap[node.id] = node.children.map((i) => i.id);
      newInv.parentMap[node.id] = parentId;
      newInv.dataMap[node.id] = node.data as any;
      for (const child of node.children) {
        walk(child, node.id);
      }
    }

    walk(newNode, appendingParentId);
  });
}

export function moveNode<T>(
  inv: InvertedTree<T>,
  movingId: string,
  toParentId: string,
  index: number | null = null
) {
  return immer(inv, (newInv) => {
    const fromParentId = newInv.parentMap[movingId] as string;

    // remove id from original
    newInv.childrenMap[fromParentId] = newInv.childrenMap[fromParentId].filter(
      (i) => i !== movingId
    );

    const childrenRef = newInv.childrenMap[toParentId];
    if (index != null) {
      childrenRef.splice(index, 0, movingId);
    } else {
      childrenRef.push(movingId);
    }

    // set new parent id
    newInv.parentMap[movingId] = toParentId;
  });
}

export function setData<T>(inv: InvertedTree<T>, nodeId: string, data: T) {
  return immer(inv, (newInv) => {
    newInv.dataMap[nodeId] = data as Draft<T>;
  });
}

export function getData<T>(inv: InvertedTree<T>, nodeId: string): T {
  return inv.dataMap[nodeId];
}

export function swapNodesInSiblings<T>(
  inv: InvertedTree<T>,
  parentId: string,
  aid: string,
  bid: string
): InvertedTree<T> {
  return immer(inv, (newInv) => {
    const children = newInv.childrenMap[parentId];
    newInv.childrenMap[parentId] = children.map((id) => {
      if (id === aid) {
        return bid;
      } else if (id === bid) {
        return aid;
      } else {
        return id;
      }
    });
  });
}

// TODO: Something wrong…
export function swapNodes<T>(
  inv: InvertedTree<T>,
  aid: string,
  bid: string
): InvertedTree<T> {
  console.info("swapNodes", aid, bid);
  const apid = inv.parentMap[aid];
  const bpid = inv.parentMap[bid];
  if (apid == null) {
    throw new Error(`${apid} is not found on tree`);
  }
  if (bpid == null) {
    throw new Error(`${bpid} is not found on tree`);
  }

  const aIndex = inv.childrenMap[apid].findIndex((ac) => ac === aid);
  const bIndex = inv.childrenMap[bpid].findIndex((bc) => bc === bid);
  if (aIndex < 0) {
    console.warn(
      "[irregular tree]",
      "apid",
      apid,
      "aid",
      aid,
      "aIndex",
      aIndex,
      "node",
      toNode(inv)
    );
    throw new Error(`${apid} ${aIndex}`);
  }
  if (bIndex < 0) {
    console.warn("[irregular tree]", toNode(inv));
    throw new Error(`${bpid} ${bIndex}`);
  }

  return immer(inv, (newInv) => {
    // newInv.
    newInv.childrenMap[apid][aIndex] = bid;
    newInv.childrenMap[bpid][bIndex] = aid;
    newInv.parentMap[apid] = bpid;
    newInv.parentMap[bpid] = apid;
  });
}
