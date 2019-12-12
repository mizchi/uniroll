import "isomorphic-unfetch";

import { compileToString } from "../index";
import assert from "assert";

it("compile with npm:delay", async () => {
  const out = await compileToString({
    entry: "/index.js",
    files: {
      "/index.js": `
        import delay from "delay";
        delay(3000);
      `,
      "/package.json": `{
        "dependencies": {
          "delay": "4.3.0"
        }
      }`
    }
  });
  expect(out).toMatchSnapshot();
});

it("compile with npm:delay via cache", async () => {
  const cache = new Map();
  const out = await compileToString({
    entry: "/index.js",
    cache: cache as any,
    files: {
      "/index.js": `
        import delay from "delay";
        delay(3000);
      `,
      "/package.json": `{
        "dependencies": {
          "delay": "4.3.0"
        }
      }`
    }
  });
  expect(out).toMatchSnapshot();

  assert(cache.has("https://cdn.jsdelivr.net/npm/delay@4.3.0/index.js"));
});

it("compile with preact", async () => {
  const out = await compileToString({
    entry: "/index.tsx",
    files: {
      "/index.tsx": `
        import { h } from "preact";
        import { useEffect } from "preact/hooks";
        function App() {
          useEffect(() => console.log("mounted"), []);
          return <div>App</div>
        }
        export default <App />;
      `,
      "/tsconfig.json": `{ "compilerOptions": { "target": "es5", "jsx": "react", "jsxFactory": "h" } }`,
      "/package.json": `{
        "dependencies": {
          "preact": "10.0.5"
        }
      }`
    }
  });
  expect(out).toMatchSnapshot();
});

it("compile with react", async () => {
  const out = await compileToString({
    entry: "/index.tsx",
    files: {
      "/index.tsx": `
        import React from "react";
        function App() {
          return <div>App</div>
        }
        export default <App />;
      `,
      "/tsconfig.json": `{ "compilerOptions": { "target": "es5", "jsx": "react" } }`,
      "/package.json": `{
        "dependencies": {
          "react": "16.7.12"
        }
      }`
    }
  });
  expect(out).toMatchSnapshot();
});
