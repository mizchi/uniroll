# uniroll

Opinionated frontend compiler in browser.

- Bundle in browser for rapid prototyping
- Resolve modules by `https://esm.sh`
- Transpile `typescript`

## How it works

- Create virtual fs by `rollup-plugin-virtual-fs`
- Load npm modules via `rollup-plugin-http-resolve`
- Compile with `typescript`
- Compile with `rollup`

## Run in browser

```
npm install uniroll typescript rollup --save
```

```js
import { bundle } from "uniroll";
const files = {
  "/foo.tsx": "export default 1",
  "/index.tsx": "import foo from 'foo';\nconsole.log('hello', foo)",
};
const bundled = await bundle({
  files,
  input: "/index.tsx",
});
const out = await bundled.generate({ format: "esm" });
console.log(out.output[0]);
```

## CLI

Run compiler with same logics.

```bash
$ npm install uniroll-tools -g
$ uniroll foo.js -o out.js
```

TODO: Options Documentation

## How to develop

```bash
# If you are not on MacOS try running `yarn --ignore-platform` instead of `yarn install`.
yarn install
yarn build
yarn test
```

## How to build your uniroll

```bash
yarn add uniroll typescript rollup
# If you want to use uniroll-svelte, add svelte
```

Add this wepback rules

```js
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.js$/,
        include: /pluginutils/, // for @rollup/pluginutils
        type: "javascript/auto",
      },
    ],
  },
};
```

## ChangeLog

### v3

- Drop `rollup-plugin-memfs` and add new `rollup-plugin-virtual-fs`
- Use `https://esm.sh`

### v2

- Use `typescript` compiler instead of `@babel/core` and dorp babel plugins.
- No more `useInMemory: true` option. Just take `fs` or `memfs`.
- Drop `package.json` reading. Use `importmaps` [WICG/import\-maps: How to control the behavior of JavaScript imports](https://github.com/WICG/import-maps)

## TODO

- Documentation
- CSS Loader / Optimizer
- Svelte usages
- include tslib

## LICENSE

MIT

- Kotaro Chikuba ~ [@mizchi](https://twitter.com/mizchi)
