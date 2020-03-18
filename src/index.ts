import fs from "fs";
import path from "path";
import { rollup, Plugin } from "rollup";
import { parse, transform } from "@babel/core";
// @ts-ignore
import env from "@babel/preset-env";
// @ts-ignore
import ts from "@babel/preset-typescript";
// @ts-ignore
import react from "@babel/preset-react";

const first: Plugin = {
  name: "first",
  async resolveId(source: string, importer: string | undefined) {
    console.log("[first.resolveId]", source, importer);
    let id = source;
    if (importer) {
      const dirname = path.dirname(importer);
      id = path.resolve(dirname, source);
    }
    return {
      id,
      external: false,
      moduleSideEffects: false,
      syntheticNamedExports: true
    };
  },
  // async transform(code: string) {
  //   console.log("[first.transform]");
  //   console.log("parsed", parse(code));
  //   return { code, ast: parse(code) };
  // },
  async load(id: string) {
    if (Math.random() > 0.5) {
      return;
    }
    console.log("[first.load]", id);
    return fs.promises.readFile(id, "utf-8");
  }
};

const second: Plugin = {
  name: "second",
  async transform(code: string) {
    console.log("[second.transform]");
    const ret = transform(code, {
      filename: "tmp.tsx",
      presets: [[env, { modules: false }], react, [ts, { jsxPragma: "React" }]]
    });
    return ret?.code as string;
  },
  async load(id: string) {
    console.log("[second.load]", id);
    return fs.promises.readFile(id, "utf-8");
  }
};

async function main() {
  const bundle = await rollup({
    input: path.join(__dirname, "../example_src/index.js"),
    plugins: [first, second]
  });

  const out = await bundle.generate({ format: "esm" });
  console.log("------------------");
  console.log(out.output[0].code);
}

main();
