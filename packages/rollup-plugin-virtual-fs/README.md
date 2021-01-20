# rollup-plugin-virtual-fs

```bash
$ npm install rollup-plugin-virtual-fs --save
# or
$ yarn add rollup-plugin-virtual-fs
```

## Options

- `files: {[fpath: string]: string}`: in memory file system.
- `extension: string`: ext search order
- `memoryOnly: boolean`: Access your file system (default: true)

## Example

```ts
// rollup.config.js
import { virtualFs } from "rollup-plugin-virtual-fs";

const files = {
  "/index.js": `import foo from "./foo";export default () => console.log(foo);`,
  "/foo.js": 'export default "foo"',
};

export default {
  input: "file:///index.js",
  plugins: [
    virtualFs({
      extensions: [".ts", ".tsx", ".js", "/index.js"], // Optional
      files: {
        "/index.js": "export default () => console.log('xxx')",
      },
    }),
  ],
};
```

## LICENSE

MIT
