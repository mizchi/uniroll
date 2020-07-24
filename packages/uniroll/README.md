# Uniroll

```
npm install uniroll
```

## Builds

- `dist/uniroll-baseline.ts`: Minimum uniroll setting
  - `rollup-plugin-memfs`: Handle in memory files as `files` option
- `dist/uniroll.ts`: (default) Output for modern browser with skypack cdn.
  - rollup
    - `rollup-plugin-skypack-cdn-resolver`
  - babel
    - presets: `@babel/preset-typescript`, `@babel/preset-react`
    - plugins: `@babel/plugin-proposal-class-properties` / `@babel/plugin-proposal-nullish-coalescing-operator` / `@babel/plugin-proposal-object-rest-spread` / `babel-plugin-transform-import-to-skypack-cdn`
  - css
    - wrap with style tag loader
- `dist/uniroll-prod.ts`: Output for legacy browser
  - css
  - - `autoprefixer` via `postcss`
  - babel
    - - `@babel/preset-env`
