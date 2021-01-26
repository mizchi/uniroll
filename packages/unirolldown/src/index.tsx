import { bundleLocal } from "uniroll";
import { parse } from "./parser";

const compile = async (
  files: { [k: string]: string },
  input = "/__run__.tsx"
) => {
  const ret = await bundleLocal({
    input,
    files,
  });
  const out = await ret.generate({ format: "es" });
  return out.output[0].code;
};

const md = `# Hello unirolldown

\`\`\`js:/App.tsx
/* @jsx h */
import { h } from "preact";
export function App() {
  return <div>hello</div>
}
\`\`\`


\`\`\`js:@dom
/* @jsx h */
import { h, render } from "preact";
import { App } from "./App";
render(<App />, document.body);
\`\`\`

\`\`\`js:@console
console.log("hello");
\`\`\`

`;
(async () => {
  const ast = parse(md);

  // for (const entry of ast.entries) {
  //   const files = {
  //     ...ast.files,
  //     "/__run__.tsx": entry.content,
  //   };
  //   const result = await compile(files);
  //   console.log(entry.runner, "\n", result);
  // }
  console.log("result", ast.ast.children[2].children[0]);
})();
