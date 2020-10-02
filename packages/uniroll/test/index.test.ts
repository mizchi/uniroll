import "isomorphic-unfetch";
import { compile } from "../src";
const files = {
  "/foo.tsx": "export default 1",
  "/index.tsx": "import foo from './foo';\nconsole.log('hello', foo)",
};
jest.setTimeout(150000);

test("build", async () => {
  try {
    const warned = [];
    const bundle = await compile({
      files,
      input: "/index.tsx",
      onwarn(warnings, defaultHandler) {
        warned.push(warnings);
        defaultHandler(warnings);
      },
    });
    // if (warned.length > 0) {
    expect(warned.length).toBe(0);
    // }
    const out = await bundle.generate({ format: "es" });
    expect(out.output[0]).toMatchSnapshot();
  } catch (err) {
    console.log(err);
    throw Error("uniroll build failed");
  }
});
