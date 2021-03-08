import ts from "@wessberg/rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";
import replace from "@rollup/plugin-replace";

const ENV = process.env.NODE_ENV || "production";

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "es",
    },
    external: ["typescript", "svelte", "uniroll"],
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
        include: [
          "../../node_modules/**/*.js",
          "../rollup-plugin-http-resolve/lib/index.js",
          "../rollup-plugin-virtual-fs/lib/index.js",
        ],
      }),
      ts({}),
      ...(ENV === "production" ? [terser({ module: true })] : []),
    ],
  },
];
