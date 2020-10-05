import "isomorphic-unfetch";

import { compile } from "../src/index";
const files = {
  "/import-map.json": JSON.stringify({
    imports: {},
  }),
  "/index.tsx": "const x = 1;console.log(x)",
};

test("transform with tsconfig", async () => {
  try {
    const bundle = await compile({
      files,
      input: "/index.tsx",
      tsconfig: {
        target: "es5",
      },
      onwarn() {},
    });
    const out = await bundle.generate({ format: "es" });
    // console.log(out.output[0].code);
    expect(out.output[0]).toMatchSnapshot();
  } catch (err) {
    console.log(err);
    throw err;
  }
});
