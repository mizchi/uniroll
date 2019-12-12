import "isomorphic-unfetch";

import { compileToString } from "../index";
import assert from "assert";

it("compile (no deps)", async () => {
  const out = await compileToString({
    entry: "/index.js",
    files: {
      "/index.js": `export default 1;`
    }
  });
  expect(out).toMatchSnapshot();
});

it("compile with relational path", async () => {
  const out = await compileToString({
    entry: "/index.js",
    files: {
      "/index.js": `export { default as foo } from "./foo"`,
      "/foo.js": "export default 2;"
    }
  });
  expect(out).toMatchSnapshot();
});

it("compile ts", async () => {
  const out = await compileToString({
    entry: "/index.ts",
    files: {
      "/index.ts": `const foo: number = 3; export default foo as number;`,
      "/tsconfig.json": `{ "compilerOptions": { "target": "es5" } }`
    }
  });
  expect(out).toMatchSnapshot();
});

it("compile tsx", async () => {
  const out = await compileToString({
    entry: "/index.tsx",
    files: {
      "/index.tsx": `const h = () => {};export default <div>1</div>`,
      "/tsconfig.json": `{ "compilerOptions": { "target": "es5", "jsx": "react", "jsxFactory": "h" } }`
    }
  });
  expect(out).toMatchSnapshot();
});

it("compile with rollupConfig", async () => {
  const out = await compileToString({
    entry: "/index.js",
    files: {
      "/index.js": `export default 1;`
    },
    rollupConfig: {
      name: "_1",
      format: "umd"
    }
  });
  assert(out.includes("define.amd"));
  expect(out).toMatchSnapshot();
});

it("compile with minify", async () => {
  const out = await compileToString({
    entry: "/index.js",
    files: {
      "/index.js": `export default 1;`
    }
  });

  const minified = await compileToString({
    entry: "/index.js",
    minify: true,
    files: {
      "/index.js": `export default 1;`
    }
  });

  assert(out.length > minified.length);
  expect(minified).toMatchSnapshot();
});
