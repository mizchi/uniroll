import ts from "@wessberg/rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { string } from "rollup-plugin-string";

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
    input: "src/svelte_internal.js",
    output: {
      dir: "prebuild",
      format: "es",
    },
    onwarn,
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: false,
      }),
      ts({
        include: ["src/*.js"],
        allowJs: true,
        target: "es5",
      }),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "es",
    },
    onwarn,
    plugins: [
      string({
        include: ["prebuild/*.js"],
      }),
      // replace({
      //   "process.platform": JSON.stringify("browser"),
      // }),
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
      terser({ module: true }),
    ],
  },
];
