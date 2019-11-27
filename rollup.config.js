import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import ignore from "rollup-plugin-ignore";
import nodeBuiltins from "rollup-plugin-node-builtins";
import { terser } from "rollup-plugin-terser";

const treeshake = {
  moduleSideEffects: false,
  propertyReadSideEffects: false,
  tryCatchDeoptimization: false
};

const fsMockedMethods = [
  "readdirSync",
  "readFile",
  "writeFile",
  "mkdirSync",
  "realpathSync",
  "statSync",
  "watch",
  "lstatSync"
];
const mockedFsScript = fsMockedMethods
  .map(
    m => `export const ${m} = () => { throw new Error("fs: not implemented"); }`
  )
  .join(";\n");

const browserBuilds = {
  input: "index.ts",
  plugins: [
    nodeResolve({ browser: true }),
    {
      load: id => {
        if (id === "fs") {
          return mockedFsScript;
        }
      }
    },
    json(),
    commonjs(),
    typescript({ include: "**/*.{ts,js}" })
    // terser({ module: true, output: { comments: "some" } })
  ],
  // treeshake,
  output: [
    { file: "dist/rollup.browser.js", format: "umd", name: "rollup" },
    { file: "dist/rollup.browser.es.js", format: "esm" }
  ]
};

export default browserBuilds;

// export default {
//   input: "index.ts",
//   output: {
//     file: "dist/bundle.esm.js",
//     format: "esm"
//   },
//   plugins: [
//     typescript(),
//     {
//       load: id => {
//         if (id === "fs") {
//           return mockedFsScript;
//         }
//       }
//     },
//     json(),
//     nodeResolve({}),
//     ignore(["resolve"]),
//     nodeBuiltins({
//       preferBuiltins: false
//     }),
//     commonjs()
//     // commonjs({
//     //   include: /node_modules/
//     // })
//   ]
// };
