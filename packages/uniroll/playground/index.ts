// import type { Plugin } from "rollup";

import "regenerator-runtime";
// import { rollup } from "rollup";
import { bundle } from "../src/index";
// import { getBaseConfig } from "../src/config/base";
// import { createMemoryFs } from "../src";

const tsRaw = `
/** @jsx h */

import foo from "./foo";
import { h, render } from "preact";
import { useState, useEffect } from "preact/hooks";

function App() {
  useEffect(() => {
    console.log("xxx");
  }, [])
  return <h1>Hello</h1>;
}

console.log(foo);
render(<App />, document.body);
`;

(async () => {
  const files = {
    "/foo.tsx": "export default 1",
    "/index.tsx": tsRaw,
  };
  // const { plugins } = getBaseConfig({
  //   fs: memfs,
  //   importmaps: {
  //     imports: {
  //       preact: "https://cdn.skypack.dev/preact@10.5.3",
  //       "preact/hooks": "https://cdn.skypack.dev/preact@10.5.3/hooks",
  //     },
  //   },
  // });
  const rolled = await bundle({
    input: "/index.tsx",
    files,
    rollupOptions: {
      onwarn(warnings) {
        console.warn("[warn]", warnings);
      },
    },
  });
  const out = await rolled.generate({
    file: "index.js",
    format: "es",
  });
  const code = out.output[0].code;
  eval(code);
})();
