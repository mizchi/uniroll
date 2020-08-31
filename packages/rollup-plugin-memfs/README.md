# rollup-plugin-memfs

```
npm install rollup-plugin-memfs --save
```

## Example

```ts
// rollup.config.js
import { Volume } from "memfs";
import createFs from "memfs/lib/promises";
import { memfsPlugin } from "rollup-plugin-memfs";

const vol = Volume.fromJSON({"/index.js": "export default 1;"})
const memfs = createFs(vol);

export default {
  input: "/index.js",
  plugins: [
    memfsPlugin(memfs);
  ],
};
```

## LICENSE

MIT
