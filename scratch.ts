import { compile } from "./index";

const pkg = {
  dependencies: {
    preact: "*",
    "lodash.flatten": "*",
    react: "16.*.*"
  }
};

const code = `
import flatten from "lodash.flatten";
import { h } from 'preact';
const el = h("div", null, "Hello");
console.log(el, flatten);
`;

async function main() {
  const out = await compile({
    pkg,
    entry: "/index",
    files: {
      "/index.js": ""
    },
    tsConfig: {}
  });
  console.log(out);
}

main();
