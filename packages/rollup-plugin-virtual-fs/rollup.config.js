import ts from "@wessberg/rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";
import replace from "@rollup/plugin-replace";
import tsService from "typescript";
import pkg from "./package.json";

const ENV = process.env.NODE_ENV || "production";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.module,
        format: "es",
      },
      {
        file: pkg.main,
        format: "commonjs",
      },
    ],
    plugins: [
      replace({
        "process.platform": JSON.stringify("browser"),
      }),
      alias({
        entries: [
          {
            find: "path",
            replacement: "path-browserify",
          },
        ],
      }),
      nodeResolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs({
        include: ["../../node_modules/**/*.js"],
      }),
      ts({
        tsconfig: {
          declaration: true,
          target: tsService.ScriptTarget.ES2019,
          allowSyntheticDefaultImports: true,
        },
      }),
      ...(ENV === "production" ? [terser({ module: true })] : []),
    ],
  },
];
