import React from "react";
import {
  LayoutEditor,
  ElementSource,
  ElementTree,
} from "uniroll-layout-editor";
import { Flex } from "@chakra-ui/core";
import { useAppState } from "../contexts";

const rootTree: ElementTree = {
  id: "$root",
  data: { elementType: "root", attrs: {} },
  children: [],
};

const sources: ElementSource[] = [
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

const LAYOUT_FILEPATH = "/layout.json";
import uniq from "lodash-es/uniq";

export function LayoutEditorPanel() {
  const { files, onSetFiles } = useAppState();
  let initialTree;
  try {
    if (files[LAYOUT_FILEPATH]) {
      initialTree = JSON.parse(files[LAYOUT_FILEPATH]);
    } else {
      initialTree = rootTree;
    }
  } catch (err) {
    initialTree = rootTree;
  }
  const keys = Object.keys(files).filter((f) => f.startsWith("/components"));
  const componentNames = uniq(keys.map((f) => f.split("/")[2]));
  const customSources = componentNames.map((n) => {
    // return {
    //   displayName: "Code:" + n,
    //   sourceType: "text",
    //   attrs: {
    //     value: n,
    //   },
    // } as ElementSource;
    return {
      displayName: "Code:" + n,
      sourceType: "code",
      attrs: {
        builtCode: n,
      },
    } as any;
  });

  return (
    <Flex w="100%" h="100%">
      <style
        dangerouslySetInnerHTML={{
          __html: ".le { color: black; background: #fff; }",
        }}
      />
      <Flex p={10} w="100%" h="100%" className="le">
        <LayoutEditor
          sources={[...sources, ...customSources]}
          initialTree={initialTree}
          onChange={(tree) => {
            const layout = JSON.stringify(tree, null, 2);
            if (files[LAYOUT_FILEPATH] !== layout) {
              onSetFiles({ ...files, [LAYOUT_FILEPATH]: layout });
            }
          }}
        />
      </Flex>
      {/* </ReactShadowRoot> */}
    </Flex>
  );
}
