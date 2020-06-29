import "isomorphic-unfetch";
import { transformImportPathToPikaCDN } from "../src/index";
import * as babel from "@babel/core";
import assert from "assert";

test("wip", () => {
  const code = `import preact from "preact";`;
  const transformed = babel.transform(code, {
    plugins: [
      transformImportPathToPikaCDN({
        preact: "10.4.4",
      }),
    ],
  });
  assert.ok(transformed!.code!.includes("https://cdn.pika.dev/preact@10.4.4"));
});
