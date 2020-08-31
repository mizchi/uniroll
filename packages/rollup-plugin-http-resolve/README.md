# rollup-plugin-http-resolve

```
npm install rollup-plugin-http-resolve --save
```

## Example

```ts
// rollup.config.js
import { httpResolve } from "rollup-plugin-http-resolve";
export default {
  input: "index.js",
  plugins: [
    httpResolve({
      cache,
    }),
  ],
};
```

## LICENSE

MIT
