# UnirollLinter

```bash
npm install uniroll-linter
```

```js
import { lint } from "uniroll-linter";
const messages = lint("xxx.yyy = 1", {
  rules: {
    "no-undef": "error"
  }
});
```
