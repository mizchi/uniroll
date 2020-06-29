import "isomorphic-unfetch";

import { compile } from "../src/index";
const files = {
  "/foo.tsx": "export default 1",
  "/index.tsx": "import foo from 'foo';\nconsole.log('hello', foo)",
};
test("build", async () => {
  const bundle = await compile({
    useInMemory: true,
    files,
    input: "/index.tsx",
  });
  // return rollup object
  const out = await bundle.generate({ format: "es" });
  console.log(out.output[0]);
});
