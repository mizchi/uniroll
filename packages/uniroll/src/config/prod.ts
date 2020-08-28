// import { WithTranspileOptions, WithTranspileResult } from "../types";
// import { TransformOptions } from "@babel/core";
// import { Options } from "../../index";
// import { createTransformer } from "uniroll-transformer";
// import { httpResolve } from "rollup-plugin-http-resolve";
// import { css } from "rollup-plugin-uniroll-css";
// import { baseline } from "./baseline";

// // @ts-ignore
// import precss from "precss";
// import postcss from "postcss";
// import autoprefixer from "autoprefixer";
// import replace from "@rollup/plugin-replace";
// import {
//   createMemoryFs,
//   readPkgVersionsIfExists,
//   readImportMapIfExists,
// } from "../helpers";
// import path from "path";

// const defaultCache = new Map();

// export async function compile(
//   options: Options & { cssPostprocess: (t: string) => string }
// ) {
//   const memfs = options.useInMemory
//     ? createMemoryFs(options.files)
//     : options.fs;
//   const rootpath = options.useInMemory
//     ? path.dirname(path.join(process.cwd(), options.input))
//     : "/";
//   const pkgPath = path.join(rootpath, "package.json");
//   const importMapPath = path.join(rootpath, "import-map.json");
//   const npmVersions = await readPkgVersionsIfExists(memfs, pkgPath);
//   const importMap = await readImportMapIfExists(memfs, importMapPath);
//   const transformer = createTransformer({
//     babel: (config) => {
//       return {
//         presets: [
//           [env, { modules: false, bugfixes: true }],
//           ...(config.plugins ?? []),
//         ],
//         ...config,
//       };
//     },
//     cdnConfig: {
//       npmVersions: npmVersions ?? undefined,
//       importMap: importMap ?? undefined,
//       onWarn: options.onWarn,
//     },
//   });

//   const baseTransformPlugin = {
//     name: "base-transform",
//     transform: async (code: string, id: string) => {
//       const { code: newCode } = await transformer(code, id);
//       return newCode;
//     },
//   };
//   return baseline({
//     ...options,
//     fs: memfs,
//     rollupPlugins: [
//       ...(options.rollupPlugins ?? []),
//       replace({
//         "process.env.NODE_ENV": "production",
//         delimiters: ["", ""],
//         ...options.replaceMap,
//       }),
//       css({ postprocess: transformWithAutoprefixer }),
//       httpResolve({
//         cache: options.cache ?? defaultCache,
//         onRequest: options.onRequest,
//         onUseCache: options.onUseCache,
//       }),
//       baseTransformPlugin,
//     ],
//   });
// }
// async function transformWithAutoprefixer(input: string) {
//   const result = await postcss([
//     precss,
//     autoprefixer({
//       // @ts-ignore
//       grid: true,
//       overrideBrowserslist: ["last 2 versions", "ie 11"],
//     }),
//   ]).process("/* autoprefixer grid: autoplace */\n" + input, {
//     from: undefined,
//   });
//   return result.css;
// }

// @ts-ignore
// import env from "@babel/preset-env";
// import { createScriptTransformer } from "uniroll-transformer/src/createTransformer";
// import { baseConfigBuilderWithTranspile } from "./baseConfigWithTranspile";
// export function prodConfigBuilder(
//   opts: WithTranspileOptions
// ): WithTranspileResult {
//   const transform = createScriptTransformer({
//     resolver: opts.resolver,
//   });
//   const scriptPlugin: any = {
//     name: "base-transform",
//     transform,
//   };
//   const config = baseConfigBuilderWithTranspile(opts);
//   return {
//     scriptTransform: transform,
//     plugins: [...config.plugins, scriptPlugin],
//   };
// }
