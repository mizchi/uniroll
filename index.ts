// @ts-ignore
import { rollup } from "rollup/dist/rollup.browser.es.js";
import cdnResolver, { CDNCache } from "rollup-plugin-cdn-resolver";
import commonjs from "rollup-plugin-commonjs";
// @ts-ignore
import json from "rollup-plugin-json";
import terser from "terser";
import { parseConfigFileTextToJson, transpileModule } from "typescript";
import memfs from "./plugins/memfs";
import replace from "rollup-plugin-replace";
// @ts-ignore
import { compile as compileSvelte } from "svelte/compiler";

export type CompileOptions = {
  entry: string;
  files: { [filepath: string]: string };
  pkg: { dependencies: any };
  tsConfig: any;
  minify?: boolean;
  typescript?: boolean;
  cache?: CDNCache;
};

export async function compile(options: CompileOptions): Promise<string> {
  const parsedTsConfig = parseConfigFileTextToJson(
    "/tsconfig.json",
    options.tsConfig
  );
  const bundle = await rollup({
    input: options.entry,
    plugins: [
      memfs(options.files, {
        transform(filename: string, value: string) {
          if (filename.endsWith(".svelte")) {
            const data = compileSvelte(value);
            // TODO: Include css
            return data.js.code;
          } else if (filename.endsWith(".vue")) {
            // WIP
            // const { code } = compiler.compile(value, {
            //   filename
            // });
            // return `export default new Function(\`${code}\`)`;
          } else if (filename.endsWith(".ts") || filename.endsWith(".tsx")) {
            const out = transpileModule(value, parsedTsConfig.config);
            return out.outputText;
          } else {
            return value;
          }
        }
      }),
      json(),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      cdnResolver({ pkg: options.pkg, cache: options.cache }) as any,
      commonjs({
        include: /^https:\/\/cdn\.jsdelivr\.net/
      })
    ]
  });

  const result = await bundle.generate({
    name: "_1",
    format: "esm"
  });

  const out = result.output[0].code as string;
  // return out.code;
  if (options.minify) {
    const minfied = terser.minify(out);
    return minfied.code as string;
  } else {
    return out;
  }
}
