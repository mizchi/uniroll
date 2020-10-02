import path from "path";
import { rollup } from "rollup";
import { memfsPlugin } from "../src/index";
// import createFs, { IPromisesAPI } from "memfs/lib/promises";
// import { Volume } from "memfs";
import assert from "assert";
import fs from "fs/promises";

test("build with memfs", async () => {
  const rolled = await rollup({
    // input: "/index.js",
    input: path.join(__dirname, "fixtures/dummy.ts"),
    plugins: [memfsPlugin(fs)],
  });
  const result = await rolled.generate({
    format: "es",
  });
  console.log(result.output[0].code);
  assert.ok(result.output[0].code.includes("export default"));
});

// test("build with fs/promises", async () => {
//   const rolled = await rollup({
//     input: path.join(__dirname, "fixtures/dummy.js"),
//     plugins: [memfsPlugin(fs as any)],
//   });
//   const result = await rolled.generate({
//     format: "es",
//   });
//   assert.ok(result.output[0].code.includes("export default"));
// });
