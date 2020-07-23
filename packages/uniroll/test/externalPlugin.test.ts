import "isomorphic-unfetch";

import { compile } from "../src/index";
// @ts-ignore
import html from "@rollup/plugin-html";
import assert from "assert";
// import { assert } from "console";

test("build", async () => {
  try {
    const bundle = await compile({
      rollupPlugins: [html({ publicPath: "./" })],
      useInMemory: true,
      files: {
        "/index.tsx": `console.log('hello');`,
      },
      input: "/index.tsx",
      onWarn: (message) => {
        console.log("onwarn", message);
      },
    });
    const out = await bundle.generate({ format: "es" });
    assert.ok(out.output[1].type === "asset");
  } catch (err) {
    console.log(err);
  }
});

test("build worker", async () => {
  try {
    const bundle = await compile({
      useInMemory: true,
      files: {
        "/foo.ts": "export default 1;",
        "/worker.ts":
          "import foo from './foo'; self.onmessage = (ev) => console.log(ev, foo)",
        "/index.tsx": `const w = new Worker("./worker.ts", {type: 'module'}); console.log(w);`,
      },
      input: "/index.tsx",
      onWarn: (message) => {
        console.log("onwarn", message);
      },
    });
    const out = await bundle.generate({ format: "es" });
    assert.ok(out.output[0].code.includes('new Worker("./worker-'));
    console.log(out.output);
  } catch (err) {
    console.log(err);
  }
});
