import ts from "@wessberg/rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import path from "path";
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

const svelteModulePath = path.join(__dirname, "node_modules/svelte");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist",
        format: "es",
      },
      {
        // dir: "dist",
        file: "dist/index.cjs.js",
        format: "commonjs",
      },
    ],
    onwarn,
    inlineDynamicImports: true,
    plugins: [
      string({
        include: [svelteModulePath + "/*.mjs", svelteModulePath + "/**/*.mjs"],
        exclude: [svelteModulePath + "/compiler.mjs"],
      }),
      nodeResolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs({
        include: ["../../node_modules/**/*.js"],
      }),
      tsPlugin,
      terser({ module: true }),
    ],
  },
];
