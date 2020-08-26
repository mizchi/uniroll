import "regenerator-runtime";
import { compile } from "../src/index";

(async () => {
  const rolled = await compile({
    css
    useInMemory: true,
    input: "/index.ts",
    files: {
      "/index.ts": "document.body.innerHTML = 'built code embedded.'",
    },
  });
  const out = await rolled.generate({ file: "index.js", format: "iife" });
  const code = out.output[0].code;
  eval(code);
})();
