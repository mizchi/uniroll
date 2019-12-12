import { rollup } from "rollup";
import cdnResolver, { CDNCache } from "rollup-plugin-cdn-resolver";
import commonjs from "rollup-plugin-commonjs";
// @ts-ignore
import json from "rollup-plugin-json";
import terser from "terser";
import { parseConfigFileTextToJson, transpileModule } from "typescript";
import memfs from "./plugins/memfs";
import replace from "rollup-plugin-replace";

export type CompileOptions = {
  entry: string;
  files: { [filepath: string]: string };
  minify?: boolean;
  cache?: CDNCache;
  rollupConfig?: any;
  replace?: any;
};

const tsconfigPath = "/tsconfig.json";
const packagePath = "/package.json";

export async function compile(options: CompileOptions) {
  let parsedTsConfig: object;
  let parsedPkg: any;

  if (options.files[tsconfigPath]) {
    const tsconfigText = options.files[tsconfigPath];
    parsedTsConfig = parseConfigFileTextToJson(tsconfigPath, tsconfigText);
  } else {
    parsedTsConfig = {};
  }

  if (options.files[packagePath]) {
    const pkgText = options.files[packagePath];
    parsedPkg = JSON.parse(pkgText);
  } else {
    parsedPkg = {
      dependencies: {}
    };
  }

  const bundle = await rollup({
    input: options.entry,
    plugins: [
      memfs(options.files, {
        transform(filename: string, value: string) {
          if (filename.endsWith(".ts") || filename.endsWith(".tsx")) {
            // @ts-ignore
            const out = transpileModule(value, parsedTsConfig.config);
            return out.outputText;
          } else {
            return value;
          }
        }
      }),
      json(),
      replace(
        options.replace ?? {
          "process.env.NODE_ENV": JSON.stringify("production")
        }
      ),
      cdnResolver({ pkg: parsedPkg, cache: options.cache }) as any,
      commonjs({
        include: /^https:\/\/cdn\.jsdelivr\.net/
      })
    ]
  });

  const result = await bundle.generate(
    options.rollupConfig ?? {
      name: "_1",
      format: "esm"
    }
  );
  return result;
}

export async function compileToString(
  options: CompileOptions
): Promise<string> {
  const result = await compile(options);
  if (result.output.length > 1) {
    throw new Error(
      "[web-compiler] Your output has multiple files. Try .compile"
    );
  }

  const out = result.output[0].code as string;
  // return out.code;
  if (options.minify) {
    const minfied = terser.minify(out);
    return minfied.code as string;
  } else {
    return out;
  }
}
