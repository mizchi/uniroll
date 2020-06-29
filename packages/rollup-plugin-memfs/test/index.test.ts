import path from "path";
import { rollup } from "rollup";
import { memfsPlugin } from "../src/index";
import createFs, { IPromisesAPI } from "memfs/lib/promises";
import { Volume } from "memfs";
import assert from "assert";
import fs from "fs/promises";

const vol = Volume.fromJSON({
  "/index.js": "const x = 1; export default x;",
});

const memfs = createFs(vol) as IPromisesAPI;

test("build with memfs", async () => {
  const rolled = await rollup({
    input: "/index.js",
    plugins: [memfsPlugin(memfs)],
  });
  const result = await rolled.generate({
    format: "es",
  });

  assert.ok(result.output[0].code.includes("export default"));
});

test("build with fs/promises", async () => {
  const rolled = await rollup({
    input: path.join(__dirname, "fixtures/dummy.js"),
    plugins: [memfsPlugin(fs as any)],
  });
  const result = await rolled.generate({
    format: "es",
  });
  assert.ok(result.output[0].code.includes("export default"));
});
