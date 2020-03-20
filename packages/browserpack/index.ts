import { Options } from "./index.d";
// @ts-ignore
import { rollup } from "rollup";
import createFs, { IPromisesAPI } from "memfs/lib/promises";
import { vol } from "memfs";
import path from "path";
import { memfsPlugin } from "rollup-plugin-memfs";
import { createTransformer } from "./baseTranform";
import { pikaCDNResolver } from "rollup-plugin-pika-cdn-resolver";

function createMemoryFs(files: { [k: string]: string }) {
  vol.fromJSON(files, "/");
  return createFs(vol) as IPromisesAPI;
}

export async function compile(options: Options) {
  const mfs = options.useInMemory
    ? createMemoryFs(options.files)
    : (options.fs as any);
  const input = options.useInMemory
    ? path.join("/", options.input)
    : path.join(options.cwd, options.input);

  const bundle = await rollup({
    input,
    plugins: [
      pikaCDNResolver({ cache: options.cache }),
      memfsPlugin(mfs),
      { name: "base-transform", transform: createTransformer() }
    ]
  });
  return bundle;
}
