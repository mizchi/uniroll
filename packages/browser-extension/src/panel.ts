import { compile } from "browserpack";

async function main() {
  const bundle = await compile({
    useInMemory: true,
    files: {
      "/index.js": "console.log(1);"
    },
    input: "/index.js"
  });
  const out = await bundle.generate({ format: "esm" });
  // console.log(out.output[0].code);
  const code = out.output[0].code;

  document.body.textContent = code;
  eval(code);
}

main();
