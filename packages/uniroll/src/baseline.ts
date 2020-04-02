import { Options } from "..";
import { rollup } from "rollup";
import createFs, { IPromisesAPI } from "memfs/lib/promises";
import { vol } from "memfs";
import path from "path";
import { memfsPlugin } from "rollup-plugin-memfs";

function createMemoryFs(files: { [k: string]: string }) {
  vol.fromJSON(files, "/");
  return createFs(vol) as IPromisesAPI;
}

export async function baseline(options: Options) {
  const mfs = options.useInMemory
    ? createMemoryFs(options.files)
    : (options.fs as any);
  const input = options.useInMemory
    ? path.join("/", options.input)
    : path.join(options.cwd, options.input);
  const bundle = await rollup({
    input,
    plugins: [...(options.rollupPlugins || []), memfsPlugin(mfs)]
  });
  return bundle;
}
