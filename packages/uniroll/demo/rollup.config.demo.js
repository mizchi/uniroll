import ts from "@wessberg/rollup-plugin-ts";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
const plugin = require("../rollup-plugin");

export default [
  {
    input: "./run.js",
    output: {
      dir: "out",
      format: "es",
    },
    plugins: [
      plugin(),
      commonjs({
        include: ["node_modules/**/*.js", "../../../node_modules/**/*.js"],
      }),
      nodeResolve({ browser: true }),
      ts({}),
    ],
  },
];
