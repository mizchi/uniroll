import type fs from 'fs';
import { rollup, OutputOptions } from "rollup";
import createFs, { IPromisesAPI } from "memfs/lib/promises";
import { vol } from "memfs";
import path from "path";
import { memfsPlugin } from "rollup-plugin-memfs";
import { transform } from "./baseTranform";

function createMemoryFs(files: { [k: string]: string }) {
  vol.fromJSON(files, "/");
  return createFs(vol) as IPromisesAPI;
}

type BaseOptions = {
  rollupOutputOptions: OutputOptions
}

export async function compile(
  options: BaseOptions & (
      {
        useInMemory: true;
        input: string;
        files: { [k: string]: string };
      }
    | {
        useInMemory: false;
        input: string;
        cwd: string;
        fs: typeof fs.promises;
      })
) {

  // console.log("options", options);
  const mfs = options.useInMemory ? createMemoryFs(options.files) : (options.fs as any);
  const input = options.useInMemory
    ? path.join("/", options.input)
    : path.join(options.cwd, options.input);

  const bundle = await rollup({
    input,
    plugins: [memfsPlugin(mfs), { name: "base-transform", transform }]
  });

  const out = await bundle.generate(options.rollupOutputOptions);
  return out;
}
