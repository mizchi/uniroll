import type { Plugin } from "rollup";

import { Command, flags } from "@oclif/command";
import path from "path";
import fs from "fs";
import { CompileOptions, getBundlePlugins } from "uniroll";
import { rollup, watch } from "rollup";
import fetch from "isomorphic-unfetch";
import { terser } from "rollup-plugin-terser";
import { extFallback } from "./extFallbackPlugin";
import { svelte } from "rollup-plugin-uniroll-svelte";
import ts from "typescript";

global.fetch = fetch;

const defaultConfig = {};

class UnirollCommand extends Command {
  static description = "uniroll cli builder";
  static flags = {
    version: flags.version({ char: "v" }),
    watch: flags.boolean({ char: "w" }),
    minify: flags.boolean({ char: "m" }),
    help: flags.help({ char: "h" }),
    output: flags.string({ char: "o", description: "output dir" }),
    format: flags.string({ char: "f", description: "output format" }),
    config: flags.string({ char: "c", description: "config path" }),
  };
  static args = [{ name: "input" }];

  async run() {
    const { args, flags } = this.parse(UnirollCommand);

    // load config
    const configPath = path.join(
      process.cwd(),
      flags.config ?? "uniroll.config.js"
    );
    let config = defaultConfig;
    if (fs.existsSync(configPath)) {
      config = require(configPath);
      this.log(`> Use config: ${configPath}`);
    }

    // input
    const inputPath = args.input.startsWith("/")
      ? args.input
      : path.join(process.cwd(), args.input);

    const { rollupOptions, input, ...others } = {
      ...config,
      input: inputPath,
      files: {}, // this is dummy,
      useVirtualFs: false,
      useNativeFs: true,
    } as CompileOptions;

    let plugins: Plugin[] = getBundlePlugins(others) as Plugin[];

    if (flags.minify) {
      plugins.push(terser({ module: true }) as Plugin);
    }
    plugins.push(extFallback({}));

    // include svelte default
    plugins.push(
      svelte({
        resolveIdFallback: others.resolveIdFallback,
        // target: ts.ScriptTarget.ES5,
      }) as Plugin
    );

    // output
    const format = (flags.format as any) ?? "es";
    let output = null;
    if (flags.output != null) {
      output = {
        format,
        dir: flags.output!.startsWith("/")
          ? flags.output
          : path.join(process.cwd(), flags.output),
      } as any;
    }
    if (flags.watch) {
      if (output == null) {
        this.error("uniroll --watch needs --output or --dir");
      }
      const watcher = watch({
        input,
        plugins,
        output,
        ...rollupOptions,
      });
      watcher.on("change", (path) => {
        console.log("[changed]", path);
      });
    } else {
      const rolled = await rollup({
        input,
        plugins,
      });
      if (output) {
        await rolled.write(output);
      } else {
        const out = await rolled.generate({
          format,
        });
        for (const output of out.output) {
          if (output.type === "asset") {
            console.log("//", output.fileName);
            console.log(output.source);
          } else {
            console.log("//", output.fileName);
            console.log(output.code);
          }
        }
      }
    }
  }
}

export = UnirollCommand;
