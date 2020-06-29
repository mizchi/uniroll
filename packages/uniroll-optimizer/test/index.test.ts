import { optimizeChunks } from "../src/index";
// How to use
// function main() {
//   const code = optimize(`const a = 1 + 1;\nexport default a`);
//   console.log(code);
// }

// main();

test("optimize", async () => {
  const ret = await optimizeChunks({
    "index.js": "console.log(true);",
    "sytle.css": "div { box-sizing: border-box; }",
  });

  expect(ret).toMatchSnapshot();
});
