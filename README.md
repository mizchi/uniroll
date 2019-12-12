# @mizchi/browserpack

You can compile frontend in browser.

```
npm install @mizchi/browserpack
```

## Example

```ts
// Need globalThis.fetch in node
// import "isomorphic-unfetch";
import { compileToString } from "@mizchi/browserpack";

const code = await compileToString({
  entry: "/index.tsx",
  files: {
    "/index.tsx": `
      import { h, render } from "preact";
      import { useEffect } from "preact/hooks";
      function App() {
        useEffect(() => console.log("mounted"), []);
        return <div>App</div>
      }
      render(<App />, document.body);
    `,
    "/tsconfig.json": `{ "compilerOptions": { "target": "es5", "jsx": "react", "jsxFactory": "h" } }`,
    "/package.json": `{
      "dependencies": {
        "preact": "10.0.5"
      }
    }`
  }
});

eval(code);
```

## TODO

- [ ] Use rollup

## LICENSE

MIT
