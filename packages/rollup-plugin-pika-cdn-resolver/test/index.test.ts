import "isomorphic-unfetch";

import createFs, { IPromisesAPI } from "memfs/lib/promises";
import { pikaCDNResolver } from "../src/index";
import { memfsPlugin } from "rollup-plugin-memfs";

import { rollup } from "rollup";
import { Volume } from "memfs";

import assert from "assert";

const vol = Volume.fromJSON({
  "/index.js": `
  import {h} from "https://cdn.pika.dev/preact";
  console.log(h);
  `,
});

const memfs = createFs(vol) as IPromisesAPI;

const cache = new Map();
test("build", async () => {
  const rolled = await rollup({
    input: "/index.js",
    plugins: [
      pikaCDNResolver({
        cache,
      }),
      memfsPlugin(memfs),
    ],
  });
  const out = await rolled.generate({ format: "es" });
  const code = out.output[0].code;
  expect(code).toMatchSnapshot();
});
