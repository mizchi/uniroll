import { parse, compile, init, run } from "../../src/index";

const md = `
# Hello unirolldown

This is demo for [unirolldown](https://github.com/mizchi/uniroll/tree/master/packages/unirolldown)


Highlighted code and export \`App\` component.

\`\`\`js:/App.tsx
/* @jsx h */
import { h } from "preact";
export function App() {
  return <div>hello</div>
}
\`\`\`

Import \`App\` and bundle it. Code will be executed on iframe.

\`\`\`js:@dom?height=100px
/* @jsx h */
import { h, render } from "preact";
import { App } from "./App";
render(<App />, document.body);
\`\`\`


Just run console

\`\`\`js:@console
console.log("log");
console.warn("warn");
console.error("error");
\`\`\`

- a
- b 
- c
`;

(async () => {
  const preview = document.querySelector(".preview") as HTMLElement;

  const runPreview = async (val: string) => {
    const ast = parse(val);
    const ret = await compile(ast.ast, ast.files);
    preview.innerHTML = ret;
  };

  await runPreview(md);

  const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
  textarea.value = md;
  textarea.addEventListener("input", async (ev: any) => {
    await runPreview(ev.target.value);
    run({ target: preview });
  });

  init({ target: preview, autoRun: true });
})();
