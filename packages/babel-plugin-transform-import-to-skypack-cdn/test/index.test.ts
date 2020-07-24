import "isomorphic-unfetch";
import { transformImportPathToSkypackCDN } from "../src/index";
import * as babel from "@babel/core";
import assert from "assert";

test("rewrite path", () => {
  const code = `import preact from "preact";`;
  const transformed = babel.transform(code, {
    plugins: [
      transformImportPathToSkypackCDN({
        preact: "10.4.4",
      }),
    ],
  });
  assert.ok(transformed!.code!.includes("https://cdn.skypack.dev/preact@10.4.4"));
});
