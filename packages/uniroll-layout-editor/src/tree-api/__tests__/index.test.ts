import assert from "assert";
import {
  walkWithMutation,
  findParentId,
  appendNodeBefore,
  appendNodeAfter,
  replaceNodeById,
  swapNodes,
  getCursor,
  setNodeWithCursor,
  // moveNode,
  Node,
} from "..";

export const sampleTree1: Node<number> = {
  id: "root",
  data: 1,
  children: [
    {
      id: "c0",
      data: 2,
      children: [],
    },
    {
      id: "c1",
      data: 3,
      children: [
        {
          id: "c1-0",
          data: 4,
          children: [],
        },
      ],
    },
  ],
};

export const sampleTree2: Node<number> = {
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
    {
      id: "c1",
      data: 4,
      children: [
        {
          id: "c1-0",
          data: 5,
          children: [],
        },
        {
          id: "c1-1",
          data: 6,
          children: [],
        },
      ],
    },
  ],
};

test("walk", () => {
  const newTree = walkWithMutation(sampleTree1, (node) => {
    if (node.id === "c0") {
      assert.equal(node.data, 2);
      node.data = 111;
    }
  });
  // @ts-ignore
  assert.equal(newTree.children[0].data, 111);
  // console.log(newTree);
});

test("findParentId", () => {
  assert.equal(findParentId(sampleTree1, "c0"), "root");
  assert.equal(findParentId(sampleTree1, "c1"), "root");
  assert.equal(findParentId(sampleTree1, "root"), null);
  assert.equal(findParentId(sampleTree1, "c1-0"), "c1");
});

test("appendNodeBefore/appendNodeAfter", () => {
  const t0 = appendNodeBefore(
    sampleTree1,
    { id: "x", data: 0, children: [] },
    "c0"
  );
  const t1 = appendNodeBefore(t0, { id: "y", data: 0, children: [] }, "c1-0");
  // @ts-ignore
  assert.equal(t1.children[0].id, "x");
  // @ts-ignore
  assert.equal(t1.children[2].children[0].id, "y");

  const t2 = appendNodeBefore(
    sampleTree1,
    { id: "z", data: 0, children: [] },
    "c1"
  );
  // @ts-ignore
  assert.equal(t2.children[0].id, "c0");
  // @ts-ignore
  assert.equal(t2.children[1].id, "z");
  // @ts-ignore
  assert.equal(t2.children[2].id, "c1");

  const t3 = appendNodeAfter(
    sampleTree1,
    { id: "k", data: 0, children: [] },
    "c0"
  );
  // @ts-ignore
  assert.equal(t3.children[0].id, "c0");
  // @ts-ignore
  assert.equal(t3.children[1].id, "k");
  // @ts-ignore
  assert.equal(t3.children[2].id, "c1");
});

test("replaceNodeById", () => {
  const newTree = replaceNodeById(
    sampleTree1,
    { id: "x", data: 1, children: [] },
    "c0"
  );
  // @ts-ignore
  assert.equal(newTree.children[0].id, "x");

  // replace root
  const newTree2 = replaceNodeById(
    sampleTree1,
    { id: "x", data: 1, children: [] },
    "root"
  );
  // @ts-ignore
  assert.equal(newTree2.id, "x");
});

test("swapNodes", () => {
  const newTree = swapNodes(sampleTree1, "c0", "c1");
  // @ts-ignore
  assert.equal(newTree.children[0].id, "c1");
  // @ts-ignore
  assert.equal(newTree.children[1].id, "c0");
});

test("getCursor", () => {
  const c0 = getCursor(sampleTree1, "c0");
  assert.deepEqual(c0, [0]);
  const c1 = getCursor(sampleTree1, "c1-0");
  assert.deepEqual(c1, [1, 0]);
});

test("setNodeWithCursor", () => {
  const r = setNodeWithCursor(
    sampleTree1,
    { id: "added", data: 0, children: [] },
    [1, 0]
  );
  // @ts-ignore
  assert.equal(r.children[1].children[0].id, "added");

  // replace root
  const r2 = setNodeWithCursor(
    sampleTree1,
    { id: "added", data: 0, children: [] },
    []
  );
  // @ts-ignore
  assert.equal(r2.id, "added");
});

// test("moveNode", () => {
//   const r = moveNode(sampleTree1, "c1-0", "c0");
//   // @ts-ignore
//   assert.deepEqual(r.children[0].children[0].id, "c1-0");
//   // @ts-ignore
//   assert.deepEqual(r.children[0].children.length, 1);
//   // @ts-ignore
//   assert.deepEqual(r.children[1].children.length, 0);
// });

// test("moveNode", () => {
//   const r = moveNode(sampleTree1, "c1-0", "c0");
//   // @ts-ignore
//   assert.deepEqual(r.children[0].children[0].id, "c1-0");
//   // @ts-ignore
//   assert.deepEqual(r.children[0].children.length, 1);
//   // @ts-ignore
//   assert.deepEqual(r.children[1].children.length, 0);
// });

// test("moveNode with index", () => {
//   const r0 = moveNode(sampleTree2, "c0-0", "c1", 1);

//   // @ts-ignore
//   assert.deepEqual(r0.children[0].children.length, 0);
//   // @ts-ignore
//   assert.deepEqual(r0.children[1].children.length, 3);
//   // @ts-ignore
//   assert.deepEqual(
//     r0.children[1].children.map((i) => i.id),
//     ["c1-0", "c0-0", "c1-1"]
//   );

//   const r1 = moveNode(sampleTree2, "c1-0", "c0", 0);

//   // @ts-ignore
//   assert.deepEqual(
//     r1.children[0].children.map((i) => i.id),
//     ["c1-0", "c0-0"]
//   );

//   // @ts-ignore
//   assert.deepEqual(
//     r1.children[1].children.map((i) => i.id),
//     ["c1-1"]
//   );
// });
