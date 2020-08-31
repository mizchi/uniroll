import "isomorphic-unfetch";

import { compile } from "../src/index";
const files = {
  "/import-map.json": JSON.stringify({
    imports: {
      preact: "https://cdn.skypack.dev/preact@10.4.3",
    },
  }),
  "/index.tsx": "import { h } from 'preact'; console.log(h('div'));",
};

test.skip("transform preact", async () => {
  try {
    const bundle = await compile({
      files,
      input: "/index.tsx",
      // onRequest: (url) => {
      //   console.log("url", url);
      // },
      onWarn: (message) => {
        console.log("onwarn", message);
      },
    });
    const out = await bundle.generate({ format: "es" });
    expect(out.output[0]).toMatchSnapshot();
  } catch (err) {
    console.log(err);
  }
});

test.only("transform nested", async () => {
  try {
    const bundle = await compile({
      importMap: {
        imports: {
          preact: "https://cdn.skypack.dev/preact",
          "preact/hooks": "https://cdn.skypack.dev/preact/hooks",
          goober: "https://cdn.skypack.dev/goober@2",
          "serialized-svg-icons/fa":
            "https://cdn.jsdelivr.net/npm/serialized-svg-icons/fa/index.js",
        },
      },
      files: {
        "/index.tsx": `
import * as sdk from "https://cdn.jsdelivr.net/npm/@plaidev/karte-action-sdk@1.0.7";
console.log(sdk);
`,
      },
      input: "/index.tsx",
      onWarn: (message) => {
        console.log("onwarn", message);
      },
    });
    const out = await bundle.generate({ format: "es" });
    expect(out.output[0]).toMatchSnapshot();
  } catch (err) {
    console.log(err);
  }
});
