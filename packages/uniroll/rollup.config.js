import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import filesize from "rollup-plugin-filesize";
import commonjs from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";

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
          path: "path-browserify",
          rollup: "rollup/dist/es/rollup.browser.js",
        },
      }),
      nodeResolve(),
      commonjs({
        include: ["../../node_modules/**/*.js"],
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
