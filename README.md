# Browserpack

Opinionated in browser compiler.

## How to use

```
npm install @mizchi/browserpack --save
```

```js
import { compile } from "@mizchi/browserpack";
const files = {
  "/foo.tsx": "export default 1"
  "/index.tsx": "import foo from 'foo';\nconsole.log('hello', foo)";
};
const bundle = await compile({
  useInMemory: true,
  files,
  input: "/index.tsx"
});
// return rollup object
const out = await bundle.generate({ format: "esm" });
console.log(out.output[0]);
```

## Example: You can import npm registry

```js
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

## How it works

- mount files on virtual fs with `memfs`: `rollup-plugin-memfs`
- transform with `@babel/preset-env`, `@babel/preset-typescript` and `browserpack/packages/babel-plugin-transform-import-to-pika-cdn`
- load npm modules with `cdn.pika.dev` via `browserpack/packages/rollup-plugin-pika-cdn-resolver`
- resolve ext with `.js` `.ts` `.tsx` `.json` `.mjs`
- transform `.css` with `browserpack/packages/rollup-plugin-browserpack-css`(like style-loader, css-loader);
- compile as `rollup(...)` and return `RollupOutput` object

## Chrome Extension

![](https://i.gyazo.com/2654174b726b6d396cfdec004cb42199.gif)

1. Check if your Node.js version is >= 12.
2. Clone this repository.
3. Install [yarn](https://yarnpkg.com/lang/en/docs/install/).
4. Run `yarn build`
5. Load your extension on Chrome following:
   1. Access `chrome://extensions/`
   2. Check `Developer mode`
   3. Click on `Load unpacked extension`
   4. Select the `build` folder.
6. Have fun.

See detail

- [Webpack docs](https://webpack.js.org)
- [Chrome Extension](https://developer.chrome.com/extensions/getstarted)

## How to develop

```
yarn workspace browserpack-ui demo
```

## LICENSE

MIT

- Kotaro Chikuba ~ [@mizchi](https://twitter.com/mizchi)
