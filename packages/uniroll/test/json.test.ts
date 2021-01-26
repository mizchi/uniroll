import "isomorphic-unfetch";
import { bundle } from "../src/bundle";

const files = {
  "/foo.json": '{ "foo": 1 }',
  "/bar.json": '{ "bar": 1 }',
  "/index.tsx":
    "import foo from './foo';import bar from './bar.json';\nconsole.log('hello', foo, bar)",
};

test("build", async () => {
  const warned = [];
  const bundled = await bundle({
    files,
    input: "/index.tsx",
    rollupOptions: {
      onwarn(warnings, defaultHandler) {
        warned.push(warnings);
        defaultHandler(warnings);
      },
    },
  });
  expect(warned.length).toBe(0);
  const out = await bundled.generate({ format: "es" });
  console.log(out.output[0].code);
  expect(out.output[0]).toMatchSnapshot();
});
