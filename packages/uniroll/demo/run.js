import { bundle } from "../dist/index.js";

console.log(bundle);
async function main() {
  const build = await bundle({
    input: "/index.js",
    files: {
      "/index.js": "console.log(1)",
    },
  });
  const out = await build.generate({ format: "iife" });
  console.log(out.output[0].code);
}
main();
