import "isomorphic-unfetch";

import { compile } from "../src/index";
const files = {
  "/foo.tsx": "export default 1",
  "/index.tsx": "import foo from './foo';\nconsole.log('hello', foo)",
};
jest.setTimeout(150000);

test("build", async () => {
  try {
    const bundle = await compile({
      useInMemory: true,
      files,
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
