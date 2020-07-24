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

test("transform preact", async () => {
  // check transformPathToImportMap before transformImportToPikaCdn
  try {
    const bundle = await compile({
      useInMemory: true,
      files,
      input: "/index.tsx",
      onRequest: (url) => {
        console.log("url", url);
      },
      onWarn: (message) => {
        console.log("onwarn", message);
      },
    });
    const out = await bundle.generate({ format: "es" });
    // console.log(out.output[0].code);
    expect(out.output[0]).toMatchSnapshot();
  } catch (err) {
    console.log(err);
  }
});
