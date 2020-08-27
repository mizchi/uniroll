// import builtins from "rollup-plugin-node-builtins";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
// import replace from "@rollup/plugin-replace";
import filesize from "rollup-plugin-filesize";
import commonjs from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";
// import nodeBuiltins from "rollup-plugin-node-builtins";

const ENV = process.env.NODE_ENV || "production";

export default [
  {
    input: "src/dev.ts",
    output: {
      dir: "dist",
      format: "es",
    },
    plugins: [
      // nodeBuiltins(),
      // builtins(),
      alias({
        entries: {
          "@rollup/pluginutils": "@rollup/pluginutils/dist/cjs/index.js",
          "@rollup/plugin-replace":
            "@rollup/plugin-replace/dist/rollup-plugin-replace.cjs.js",
          "@rollup/plugin-json": "@rollup/plugin-json/dist/index.js",

          path: "path-browserify",
          rollup: "rollup/dist/es/rollup.browser.js",
        },
      }),
      nodeResolve(),
      commonjs({
        // include: ["../../node_modules/**"],
        include: [
          "../uniroll-transformer/dist/uniroll-transformer.js",
          // "node_modules/**/*.js",
          "../../node_modules/**/*.js",
          //   // "node_modules/memfs/lib/index.js",
        ],
      }),
      typescript({
        target: "es2019",
        module: "esnext",
        include: ["../**/*.ts"],
      }),
      // replace({
      //   "process.env.NODE_ENV": JSON.stringify(ENV),
      // }),
      ...(ENV === "production" ? [terser(), filesize()] : []),
    ],
  },
];
