import React from "react";
import ReactDOM from "react-dom";
import { compile, InMemoryOption } from "uniroll";
import type { Files } from "..";
import type { EnvInput } from "../";
import { UnirollEnvProvider } from "./components/contexts";
import { downloadToLocal, loadFromLocal } from "./helpers";
import { App, defaultLayout } from "./index";
import { LayoutEditorPanel } from "./components/panels/LayoutEditorPanel";

const inintialFiles: Files = {
  "/components/foo/index.js": "export default 'foo'",
  "/style.css": `.container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 120px 4fr 1fr;
  grid-template-rows: 60px 1fr 40px;
  grid-template-areas: 'header header header' 'left content right' 'footer footer footer';
}`,
  "/index.tsx": `/** @jsx h */
import "./style.css";
import { h, render, Fragment } from "preact";
import layout from "./layout.json";
import flatten from "lodash.flatten";
console.log("started");

function View(props: { tree: ElementTree }) {
  const data = props.tree.data;
  switch (data.elementType) {
    case "root": {
      return (
        <div style={{width: "100%", height: "100%"}}>
          {props.tree.children.map((c) => {
            return <View key={c.id} tree={c} />;
          })}
        </div>
      );
    }

    case "flex": {
      return (
        <div style={{ flexDirection: data.attrs.direction, width: "100%", height: "100%" }}>
          {props.tree.children.map((c) => {
            return <View key={c.id} tree={c} />;
          })}
        </div>
      );
    }

    case "grid": {
      const gridAreaNames = flatten(data.attrs.areas);
      const { rows, columns, areas } = data.attrs;
      return (
        <div style={{ display: "grid", gridTemplateRows: rows.join(" "), gridTemplateColumns: columns.join(" "), gridTemplateAreas: areas.map(a => "'" + a.join(' ') + "'").join(" ") , width: "100%", height: "100%"}}>
          {gridAreaNames.map((gridArea) => {
            const existNode = props.tree.children.find((c) => {
              return (
                c.data.elementType === "grid-area" &&
                c.data.attrs.gridArea === gridArea
              );
            });
            return (
              <div style={{ gridArea: gridArea}} key={gridArea}>
                {existNode && <View key={existNode.id} tree={existNode} />}
              </div>
            );
          })}
        </div>
      );
    }
    case "grid-area": {
      return (
        <Fragment>
          {props.tree.children.map((c) => {
            return <View key={c.id} tree={c} />;
          })}
        </Fragment>
      );
    }
    case "text": {
      return <div style={{width: "100%", height: "100%"}}>{data.attrs.value}</div>;
    }
    case "image": {
      return (
        <div style={{width: "100%", height: "100%"}}>
          <img
            src={data.attrs.src}
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </div>
      );
    }
    default: {
      return <div style={{width: "100%", height: "100%"}}>WIP: {data.elementType}</div>;
    }
  }
}

render(<View tree={layout} />, document.body);    
`,

  "/variables.json": JSON.stringify([], null, 2),
  "/layout.json": JSON.stringify(
    {
      id: "$root",
      children: [
        {
          id: "5",
          children: [
            {
              id: "1",
              children: [
                {
                  id: "6",
                  children: [],
                  data: {
                    elementType: "text",
                    attrs: {
                      value: "FQ10T",
                    },
                  },
                },
              ],
              data: {
                elementType: "grid-area",
                attrs: {
                  gridArea: "a",
                },
              },
            },
            {
              id: "2",
              children: [
                {
                  id: "7",
                  children: [],
                  data: {
                    elementType: "image",
                    attrs: {
                      src:
                        "http://imgcc.naver.jp/kaze/mission/USER/20140612/42/4930882/68/598x375xe4022b20b838933f265c1591.jpg",
                    },
                  },
                },
              ],
              data: {
                elementType: "grid-area",
                attrs: {
                  gridArea: "b",
                },
              },
            },
            {
              id: "3",
              children: [],
              data: {
                elementType: "grid-area",
                attrs: {
                  gridArea: "c",
                },
              },
            },
            {
              id: "4",
              children: [],
              data: {
                elementType: "grid-area",
                attrs: {
                  gridArea: "d",
                },
              },
            },
          ],
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
        },
      ],
      data: {
        elementType: "root",
        attrs: {},
      },
    },
    null,
    2
  ),

  "/package.json": `{
  "dependencies": {
    "preact": "10.3.4"
  }
}`,
};

defaultLayout.leftTabs.push({
  id: "layout",
  displayName: "Layout",
  component: LayoutEditorPanel,
});

const cache = new Map();
const env: EnvInput = {
  layout: defaultLayout,
  inExtension: false,
  async compile(options: InMemoryOption) {
    return compile({
      ...options,
      cache,
      onWarn: (mes) => console.log("[warn]", mes),
      onRequest: (id) => {
        console.log("[request]", id);
      },
      onUseCache: (id) => {
        console.log("[cache]", id);
      },
    });
  },
  async loadLastState() {
    return {
      files: inintialFiles,
    };
  },
  downloadToLocal,
  loadFromLocal,
};

ReactDOM.render(
  <UnirollEnvProvider value={env}>
    <App />
  </UnirollEnvProvider>,
  document.querySelector("#root")
);
