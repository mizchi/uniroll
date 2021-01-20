import "isomorphic-unfetch";

import { bundle } from "../src/bundle";
const files = {
  "/index.tsx": "import { h } from 'preact'; console.log(h('div'));",
};

test("transform preact", async () => {
  try {
    const bundled = await bundle({
      files,
      input: "/index.tsx",
      rollupOptions: {
        onwarn() {},
      },
    });
    const out = await bundled.generate({ format: "es" });
    expect(out.output[0]).toMatchSnapshot();
  } catch (err) {
    console.log(err);
  }
});

test("transform nested", async () => {
  try {
    const bundled = await bundle({
      // importmaps: {
      //   imports: {
      //     preact: "https://cdn.skypack.dev/preact",
      //     "preact/hooks": "https://cdn.skypack.dev/preact/hooks",
      //     goober: "https://cdn.skypack.dev/goober@2",
      //     "serialized-svg-icons/fa":
      //       "https://cdn.jsdelivr.net/npm/serialized-svg-icons/fa/index.js",
      //   },
      // },
      files: {
        "/index.tsx": `
import * as sdk from "https://cdn.jsdelivr.net/npm/@plaidev/karte-action-sdk@1.0.7";
console.log(sdk);
`,
      },
      input: "/index.tsx",
      rollupOptions: {
        onwarn() {},
      },
    });
    const out = await bundled.generate({ format: "es" });
    expect(out.output[0]).toMatchSnapshot();
  } catch (err) {
    console.log(err);
  }
});
