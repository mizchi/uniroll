import { rollup } from "rollup";
import { virtualFs } from "../src/index";
import assert from "assert";

test("build entry", async () => {
  const rolled = await rollup({
    input: "/index.js",
    plugins: [virtualFs({ files: { "/index.js": "export default 1" } })],
  });
  const result = await rolled.generate({
    format: "es",
  });
  assert.ok(result.output[0].code.includes("export default"));
});

test("build entry with file schema", async () => {
  const rolled = await rollup({
    input: "file:///index.js",
    plugins: [virtualFs({ files: { "/index.js": "export default 1" } })],
  });
  const result = await rolled.generate({
    format: "es",
  });
  assert.ok(result.output[0].code.includes("export default"));
});

test("build relative path", async () => {
  const rolled = await rollup({
    input: "file:///index.js",
    plugins: [
      virtualFs({
        files: {
          "/foo.js": "export default 'foo';",
          "/xxx.js": "export default 'xxx';",
          "/bar/index.js": "export default 'bar'",
          "/index.js": `
import foo from './foo';
import bar from './bar';
import xxx from 'file:./xxx.js';
console.log(foo, bar, xxx);
      `,
        },
      }),
    ],
  });
  const result = await rolled.generate({
    format: "es",
  });
  assert.ok(result.output[0].code.includes("foo"));
  assert.ok(result.output[0].code.includes("bar"));
  assert.ok(result.output[0].code.includes("xxx"));
});
