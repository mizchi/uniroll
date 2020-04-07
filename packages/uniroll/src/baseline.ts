import { Options } from "..";
import { rollup } from "rollup";
import path from "path";
import { memfsPlugin } from "rollup-plugin-memfs";

export async function baseline(options: Options & { fs: any }) {
  const fs = options.fs;

  const input = options.useInMemory
    ? path.join("/", options.input)
    : path.join(options.cwd, options.input);

  const bundle = await rollup({
    input,
    plugins: [...(options.rollupPlugins || []), memfsPlugin(fs)],
  });
  return bundle;
}
