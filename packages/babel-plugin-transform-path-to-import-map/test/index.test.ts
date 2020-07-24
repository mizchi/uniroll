import transformImportMap from "../index";
import * as babel from "@babel/core";
import assert from "assert";

test("rewirte with import map", () => {
  const code = `import preact from "preact";`;
  const transformed = babel.transform(code, {
    plugins: [
      transformImportMap({
        imports: {
          preact: "https://cdn.skypack.dev/preact@10.4.4",
        },
      }),
    ],
  });
  assert.ok(transformed!.code!.includes("https://cdn.skypack.dev/preact@10.4.4"));
});
