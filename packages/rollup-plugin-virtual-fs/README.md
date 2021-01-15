# rollup-plugin-virtual-fs

```
npm install rollup-plugin-memfs --save
```

## Example

```ts
// rollup.config.js
import { virtualFs } from "rollup-plugin-virtual-fs";

const files = {
  "file:///index.js"
}

export default {
  input: "file:///index.js",
  plugins: [
    virtualFs(files)
  ],
};
```

## LICENSE

MIT
