import { compile } from "../index";
import assert from "assert";

it("compile (no deps)", async () => {
  const pkg = {
    dependencies: {
      "lodash.flatten": "*"
    }
  };

  const code = `export default 1`;
  const out = await compile(code, { pkg });
  assert.equal(out, "");
});

it("compile preact (single built)", async () => {
  const pkg = {
    dependencies: {
      "lodash.flatten": "*",
      preact: "10.*.*"
    }
  };

  const code = `
  import flatten from "lodash.flatten";
  import { h } from 'preact';
  const el = h("div", null, "Hello");
  console.log(el, flatten);
  `;

  const out = await compile(code, { pkg });
  assert.ok(out);
});

it.skip("compile react (multi file entry)", async () => {
  const pkg = {
    dependencies: {
      react: "16.*.*"
    }
  };

  const code = `import React from "react";console.log(React);`;

  const out = await compile(code, { pkg });
  assert.ok(out);
});
