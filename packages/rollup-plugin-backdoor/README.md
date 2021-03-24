# rollup-plugin-backdoor

Open backdoor to access instance via global vars.

CAUTION: Only for rollup in browser(main-thread).

````bash
$ npm install rollup-plugin-backdoor --save
# or
$ yarn add rollup-plugin-virtual-fs
```g

## Options

- `instances: {[name: string]: any}`

## Example

```ts
// runner code
import Foo from "backdoor:Foo";
new Foo();
````

```ts
// rollup.config.js
import { backdoor } from "rollup-plugin-backdoor";

export default {
  plugins: [
    backdoor({
      instances: {
        Foo: class Foo {}, // open in memory proxy
      },
    }),
    // ..
  ],
};
```

## LICENSE

MIT
