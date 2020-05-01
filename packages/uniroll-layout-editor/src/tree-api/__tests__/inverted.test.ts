import assert from "assert";
import { sampleTree1, sampleTree2 } from "./index.test";
import { Node } from "../index";
import * as treeUtils from "../inverted";

test("inv:toInvertedTree", () => {
  const inv = treeUtils.toInvertedTree({ id: "1", data: 1, children: [] });
  assert.deepEqual(inv, {
    childrenMap: {
      "1": [],
    },
    dataMap: {
      "1": 1,
    },
    parentMap: {
      "1": null,
    },
  });
  const inv2 = treeUtils.toInvertedTree({
    id: "1",
    data: 1,
    children: [{ id: "2", data: 2, children: [] }],
  });
  assert.deepEqual(inv2, {
    childrenMap: {
      "1": ["2"],
      "2": [],
    },
    dataMap: {
      "1": 1,
      "2": 2,
    },
    parentMap: {
      "1": null,
      "2": "1",
    },
  });
});
test("inv:appendNode", () => {
  const inv = treeUtils.toInvertedTree({ id: "1", data: 0, children: [] });
  const inv2 = treeUtils.appendNode(
    inv,
    { id: "2", data: 0, children: [] },
    "1"
  );
  assert.deepEqual(inv2, {
    childrenMap: {
      "1": ["2"],
      "2": [],
    },
    dataMap: {
      "1": 0,
      "2": 0,
    },
    parentMap: {
      "1": null,
      "2": "1",
    },
  });
  const inv3 = treeUtils.appendNode(
    inv2,
    { id: "3", data: 0, children: [] },
    "1",
    0
  );
  assert.deepEqual(inv3, {
    childrenMap: {
      "1": ["3", "2"],
      "2": [],
      "3": [],
    },
    dataMap: {
      "1": 0,
      "2": 0,
      "3": 0,
    },
    parentMap: {
      "1": null,
      "2": "1",
      "3": "1",
    },
  });
});

test("inv:appendNode recusive node", () => {
  const inv = treeUtils.toInvertedTree({ id: "1", data: 0, children: [] });
  const inv2 = treeUtils.appendNode(
    inv,
    {
      id: "2",
      data: 0,
      children: [
        {
          id: "3",
          data: 0,
          children: [],
        },
      ],
    },
    "1"
  );
  assert.deepEqual(inv2, {
    childrenMap: {
      "1": ["2"],
      "2": ["3"],
      "3": [],
    },
    dataMap: {
      "1": 0,
      "2": 0,
      "3": 0,
    },
    parentMap: {
      "1": null,
      "2": "1",
      "3": "2",
    },
  });
});

test("inv:moveNode", () => {
  const inv = treeUtils.toInvertedTree({
    id: "1",
    data: 1,
    children: [
      { id: "2", data: 2, children: [] },
      { id: "3", data: 3, children: [] },
    ],
  });
  const inv2 = treeUtils.moveNode(inv, "2", "3");
  const node = treeUtils.toNode(inv2);
  assert.deepEqual(node, {
    id: "1",
    data: 1,
    children: [
      { id: "3", data: 3, children: [{ id: "2", data: 2, children: [] }] },
    ],
  });
});

test("inv:moveNode with index", () => {
  const inv = treeUtils.toInvertedTree({
    id: "1",
    data: 1,
    children: [
      { id: "2", data: 2, children: [] },
      { id: "3", data: 3, children: [] },
    ],
  });
  const inv2 = treeUtils.moveNode(inv, "3", "1", 0);
  const node = treeUtils.toNode(inv2);
  assert.deepEqual(node, {
    id: "1",
    data: 1,
    children: [
      { id: "3", data: 3, children: [] },
      { id: "2", data: 2, children: [] },
    ],
  });
});

test("inv:swapNodesInSiblings", () => {
  const inv = treeUtils.toInvertedTree({
    id: "1",
    data: 1,
    children: [
      { id: "2", data: 2, children: [] },
      { id: "3", data: 3, children: [] },
    ],
  });
  const inv2 = treeUtils.swapNodesInSiblings(inv, "1", "2", "3");
  const node = treeUtils.toNode(inv2);
  assert.deepEqual(node, {
    id: "1",
    data: 1,
    children: [
      { id: "3", data: 3, children: [] },
      { id: "2", data: 2, children: [] },
    ],
  });
});

test("inv:toNode", () => {
  const inv = treeUtils.toInvertedTree(sampleTree2);
  const node = treeUtils.toNode(inv);
  assert.deepEqual(sampleTree2, node);
});

test("inv:removeNode", () => {
  const t: Node<number> = {
    id: "root",
    data: 1,
    children: [
      {
        id: "c0",
        data: 2,
        children: [],
      },
    ],
  };
  const inv = treeUtils.toInvertedTree(t);
  const inv2 = treeUtils.removeNode(inv, "c0");
  const node = treeUtils.toNode(inv2);
  assert.deepEqual(node, {
    id: "root",
    data: 1,
    children: [],
  });
});

test("inv:removeNode deep", () => {
  const t: Node<number> = {
    id: "root",
    data: 1,
    children: [
      {
        id: "c0",
        data: 2,
        children: [
          {
            id: "c0-0",
            data: 3,
            children: [],
          },
        ],
      },
    ],
  };

  const inv = treeUtils.toInvertedTree(t);
  const inv2 = treeUtils.removeNode(inv, "c0");
  const node = treeUtils.toNode(inv2);
  assert.deepEqual(node, {
    id: "root",
    data: 1,
    children: [],
  });

  assert.deepEqual(inv2, {
    childrenMap: { root: [] },
    parentMap: { root: null },
    dataMap: { root: 1 },
  });
});
