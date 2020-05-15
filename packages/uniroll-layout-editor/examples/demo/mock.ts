import { ElementTree, ElementSource } from "../../src/types";
import { ulid } from "ulid";
import range from "lodash-es/range";

export const sources: ElementSource[] = [
  {
    displayName: "Text",
    sourceType: "text",
    attrs: {
      value: "",
    },
  },
  {
    displayName: "Image",
    sourceType: "image",
    attrs: {
      src:
        "http://imgcc.naver.jp/kaze/mission/USER/20140612/42/4930882/68/598x375xe4022b20b838933f265c1591.jpg",
    },
  },
  {
    displayName: "Row",
    sourceType: "flex",
    attrs: {
      direction: "row",
    },
  },
  {
    displayName: "Column",
    sourceType: "flex",
    attrs: {
      direction: "column",
    },
  },
  {
    displayName: "Grid(1x1)",
    sourceType: "grid",
    attrs: {
      rows: ["1fr"],
      columns: ["1fr"],
      areas: [["a"]],
    },
  },
  {
    displayName: "Grid(2x2)",
    sourceType: "grid",
    attrs: {
      rows: ["1fr", "1fr"],
      columns: ["1fr", "1fr"],
      areas: [
        ["a", "b"],
        ["c", "d"],
      ],
    },
  },
  {
    displayName: "Wysiwyg",
    sourceType: "wysiwyg",
    attrs: {
      data: [],
    },
  },
];

export const sampleTree: ElementTree = {
  id: "$root",
  data: { elementType: "root", attrs: {} },
  children: [
    {
      id: ulid(),
      data: {
        elementType: "grid",
        attrs: {
          rows: ["1fr", "1fr"],
          columns: ["1fr", "1fr"],
          areas: [
            ["a", "b"],
            ["c", "d"],
          ],
        },
      },
      children: [
        {
          id: ulid(),
          data: {
            elementType: "grid-area",
            attrs: {
              gridArea: "a",
            },
          },
          children: [
            {
              id: ulid(),
              data: { elementType: "text", attrs: { value: "foo" } },
              children: [],
            },
          ],
        },
        {
          id: ulid(),
          data: {
            elementType: "grid-area",
            attrs: {
              gridArea: "b",
            },
          },
          children: [],
        },
        {
          id: ulid(),
          data: {
            elementType: "grid-area",
            attrs: {
              gridArea: "c",
            },
          },
          children: [
            {
              id: ulid(),
              data: {
                elementType: "grid",
                attrs: {
                  rows: ["1fr"],
                  columns: ["1fr", "1fr"],
                  areas: [["e", "f"]],
                },
              },
              children: [
                {
                  id: ulid(),
                  data: {
                    elementType: "grid-area",
                    attrs: {
                      gridArea: "e",
                    },
                  },
                  children: [
                    {
                      id: ulid(),
                      data: {
                        elementType: "flex",
                        attrs: {
                          direction: "column",
                        },
                      },
                      children: [],
                    },
                  ],
                },
                {
                  id: ulid(),
                  data: {
                    elementType: "grid-area",
                    attrs: {
                      gridArea: "f",
                    },
                  },
                  children: [
                    {
                      id: ulid(),
                      data: {
                        elementType: "text",
                        attrs: {
                          value: "yyy",
                        },
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: ulid(),
          data: {
            elementType: "grid-area",
            attrs: {
              gridArea: "d",
            },
          },
          children: [
            {
              id: ulid(),
              data: {
                elementType: "image",
                attrs: {
                  src:
                    "http://imgcc.naver.jp/kaze/mission/USER/20140612/42/4930882/68/598x375xe4022b20b838933f265c1591.jpg",
                },
              },
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

export const rootTree: ElementTree = {
  id: "$root",
  data: { elementType: "root", attrs: {} },
  children: [],
};

export const flexTree: ElementTree = {
  id: "$root",
  data: { elementType: "root", attrs: {} },
  children: [
    {
      id: ulid(),
      data: {
        elementType: "flex",
        attrs: {
          direction: "column",
        },
      },
      children: [
        {
          id: ulid(),
          data: {
            elementType: "text",
            attrs: {
              value: "text",
            },
          },
          children: [],
        },
      ],
    },
  ],
};

export const gridTree: ElementTree = {
  id: "$root",
  data: { elementType: "root", attrs: {} },
  children: [
    {
      id: ulid(),
      data: {
        elementType: "grid",
        attrs: {
          rows: ["1fr", "1fr", "1fr"],
          columns: ["1fr", "1fr", "1fr"],
          areas: [
            ["a", "b", "c"],
            ["d", "e", "f"],
            ["g", "h", "i"],
          ],
        },
      },
      children: range(9).map((i) => {
        console.log("area", String.fromCharCode(97 + i));
        return {
          id: ulid(),
          data: {
            elementType: "grid-area",
            attrs: {
              // from a to z
              gridArea: String.fromCharCode(97 + i),
            },
          },
          children: [],
        };
      }),
    },
  ],
};

export const wysiwigTree: ElementTree = {
  id: "$root",
  data: { elementType: "root", attrs: {} },
  children: [
    {
      id: ulid(),
      data: {
        elementType: "wysiwyg",
        attrs: {
          data: [],
        },
      },
      children: [],
    },
  ],
};
