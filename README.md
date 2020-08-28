# uniroll

Opinionated rollup wrapper to work in browser.

demo https://focused-raman-3ce115.netlify.com/

## Run in browser

```
npm install uniroll --save
```

```js
import { compile } from "uniroll";
const files = {
  "/foo.tsx": "export default 1",
  "/index.tsx": "import foo from 'foo';\nconsole.log('hello', foo)",
};
const bundle = await compile({
  files,
  input: "/index.tsx",
});
const out = await bundle.generate({ format: "esm" });
console.log(out.output[0]);
```

## as rollup plugin usage

```ts
import { rollup } from "rollup";
import { getBaseConfig } from "uniroll";

const files = {
  "/foo.ts": "export default 1",
  "/index.tsx": 'import foo from "./foo";console.log(foo);',
};
const memfs = createMemoryFs(files);
const { plugins } = getBaseConfig({ fs: memfs });
const rolled = await rollup({
  input: "/index.tsx",
  plugins,
});
// use it as rollup modules
```

## via CDN

```html
<script
  async
  src="https://cdn.jsdelivr.net/npm/uniroll@2.0.0/dist/uniroll.js"
></script>
<script>
  Uniroll.compile({...})
</script>
```

## Example: import npm registry

```tsx
import { h, render } from "preact";
import { styled, setPragma } from "goober";

setPragma(h);

const PopupWrapper = styled("div")`
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 200px;
  height: 100px;
  background-color: wheat;
`;

function Popup() {
  return <PopupWrapper>Hello!</PopupWrapper>;
}

const el = document.createElement("div");
render(<Popup value={text} />, el);
document.body.appendChild(el);
```

## Run in node

Run compiler with same logics.

```bash
$ npm install uniroll-tools -g
$ uniroll foo.js -o out.js
```

## How it works

- Create virtulas fs with `memfs`: `rollup-plugin-memfs`
- Load npm modules via `rollup-plugin-http-resolver`
- Compile with `rollup`.

## How to develop

```
yarn install
yarn build
yarn test
```

## LICENSE

MIT

- Kotaro Chikuba ~ [@mizchi](https://twitter.com/mizchi)
