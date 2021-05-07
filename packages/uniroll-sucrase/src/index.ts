import type {
  OutputOptions,
  OutputPlugin,
  RollupOutput,
  RollupWarning,
} from "rollup";
import { transform } from "sucrase";
import { rollup } from "rollup";
import { virtualFs } from "rollup-plugin-virtual-fs";
import type { RollupOptions, Plugin } from "rollup";
import { sveltePlugin } from "./plugin_svelte";

type UnirollPlugin = Plugin & {
  enforce?: "pre" | "post";
};

type BundleOptions = Omit<RollupOptions, "plugins"> & {
  output?: OutputOptions;
  files: { [k: string]: string };
  plugins?: UnirollPlugin[];
};

const base = () => {
  return {
    name: "base-transform",
    transform(code: string, id: string) {
      if (id.endsWith(".ts") || id.endsWith(".tsx")) {
        return transform(code, {
          transforms: ["typescript", "jsx"],
        });
      }
    },
  } as UnirollPlugin;
};

const toPriority = (enforce?: "pre" | "post") =>
  enforce === "pre" ? -1 : enforce === "post" ? 1 : 0;

const pluginSortFunc = (a: UnirollPlugin, b: UnirollPlugin) => {
  return toPriority(a.enforce) >= toPriority(b.enforce) ? 1 : -1;
};

const defaultOnwarn = (
  warn: RollupWarning,
  next: (next: RollupWarning) => void
) => {
  if (warn.message && warn.message.includes("'this' keyword")) return;
  next(warn);
};

function defineConfig(
  options: BundleOptions
): Omit<RollupOptions, "output"> & { output: OutputOptions } {
  const { files, ...rollupOptions } = options;
  const newPlugins = [
    ...(rollupOptions.plugins ?? []),
    base(),
    sveltePlugin({
      emitCss: false,
    }),
    virtualFs({
      files,
    }),
  ] as UnirollPlugin[];

  newPlugins.sort(pluginSortFunc);

  return {
    ...rollupOptions,
    onwarn: rollupOptions.onwarn ?? defaultOnwarn,
    plugins: newPlugins,
    output: defaultOutputOptions as OutputPlugin,
  };
}

const defaultOutputOptions: OutputOptions = {
  format: "es",
};

export async function bundle(options: BundleOptions): Promise<RollupOutput> {
  const { output, ...rawConfig }: RollupOptions = defineConfig(options);
  const build = await rollup(rawConfig);
  return build.generate(output);
}
