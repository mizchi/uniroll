import "regenerator-runtime";
import { compile } from "../src";

const appCode = `window.alert("hello uniroll vue!");
`;

const vueTsCode = `
`;

(async () => {
  const files = {
    "/index.ts": appCode,
    "/App.vue": vueTsCode,
  };
  const rolled = await compile({
    files,
    input: "/index.ts",
    importmaps: {
      imports: {
        vue: "https://unpkg.com/vue@3.0.0/dist/vue.runtime.esm-browser.js"
      },
    },
  });
  const out = await rolled.generate({
    file: "index.js",
    format: "iife",
    name: "playground",
  });
  const code = out.output[0].code;
  eval(code);
})().catch((err) => {
  console.error(err);
});
