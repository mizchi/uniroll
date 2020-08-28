import "isomorphic-unfetch";
import { compile } from "../src";
const files = {
  "/foo.tsx": "export default 1",
  "/index.tsx": "import foo from './foo';\nconsole.log('hello', foo)",
};
jest.setTimeout(150000);

test("build", async () => {
  try {
    const bundle = await compile({
      files,
      input: "/index.tsx",
      onWarn: (message) => {
        console.log("[warn]", message);
      },
    });
    const out = await bundle.generate({ format: "es" });
    expect(out.output[0]).toMatchSnapshot();
  } catch (err) {
    console.log(err);
  }
});
