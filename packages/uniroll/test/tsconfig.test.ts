import "isomorphic-unfetch";
import ts from "typescript";

import { bundle } from "../src/bundle";
const files = {
  "/import-map.json": JSON.stringify({
    imports: {},
  }),
  "/index.tsx": "const x = 1;console.log(x)",
};

test("transform with tsconfig", async () => {
  try {
    const bundled = await bundle({
      files,
      input: "/index.tsx",
      compilerOptions: {
        target: ts.ScriptTarget.ES5,
      },
      rollupOptions: {
        onwarn() {},
      },
    });
    const out = await bundled.generate({ format: "es" });
    // console.log(out.output[0].code);
    expect(out.output[0]).toMatchSnapshot();
  } catch (err) {
    console.log(err);
    throw err;
  }
});
