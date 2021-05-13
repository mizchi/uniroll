import ts from "@wessberg/rollup-plugin-ts";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const tsPlugin = ts({
  include: [
    "src/*.ts",
    "../rollup-plugin-http-resolve/lib/index.js",
    "../rollup-plugin-virtual-fs/lib/index.js",
    "../../node_modules/**/*.js",
  ],
});

function onwarn(warn, next) {
  if (warn.code === "CIRCULAR_DEPENDENCY") {
    return;
  }
  next(warn);
}

export default [
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist",
        format: "es",
      },
      {
        file: "dist/index.cjs.js",
        format: "commonjs",
      },
    ],
    onwarn,
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs({
        include: [
          "../../node_modules/**/*.js",
          "../rollup-plugin-http-resolve/lib/index.js",
          "../rollup-plugin-virtual-fs/lib/index.js",
        ],
      }),
      tsPlugin,
      // terser({ module: true }),
    ],
  },
];
