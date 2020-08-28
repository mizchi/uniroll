import "isomorphic-unfetch";
import path from "path";
import { rollup } from "rollup";
import fs from "fs";
import meow from "meow";
import { optimizeJs } from "uniroll-optimizer";
import { lint as linter } from "uniroll-linter";
import { getBaseConfig } from "uniroll/lib/config/base";

type BundleOptions = {
  input: string;
  config: string;
  type: "memory" | "local";
  print?: boolean;
  out?: string;
  outdir?: string;
  minify?: boolean;
  lint?: boolean;
};

async function bundle(options: BundleOptions) {
  const {
    input,
    type,
    out,
    outdir,
    minify,
    print,
    lint,
    config: configPath = "uniroll.config.js",
    ...others
  } = options;

  let config;
  try {
    const fpath = path.join(process.cwd(), configPath);
    config = require(fpath);
  } catch (err) {
    config = {};
  }
  const { plugins } = getBaseConfig({ fs: fs.promises, ...config });
  const rolled = await rollup({
    input,
    plugins,
  });

  const output = await rolled.generate(others);

  if (output == null) {
    throw new Error("bundle error");
  }

  if (outdir) {
    try {
      fs.mkdirSync(path.join(process.cwd(), outdir));
    } catch (err) {}
  }

  if (print) {
    for (const i of output.output) {
      if (i.type === "chunk") {
        console.log(`// ${i.fileName}\n${i.code}`);
      }
    }
    return;
  }

  for (const i of output.output) {
    if (i.type === "chunk") {
      if (outdir) {
        const outpath = path.join(process.cwd(), outdir, i.fileName);
        fs.writeFileSync(outpath, i.code);
      }
      if (lint) {
        const messages = linter(i.code);
        console.log("lint result", messages);
      }
      if (out) {
        const outpath = path.join(process.cwd(), out);
        const code = minify ? await optimizeJs(i.code) : i.code;
        fs.writeFileSync(outpath, code);
      }
    }
  }
}

async function run(args: [cmd: string, input: string], options: BundleOptions) {
  const [cmd, input] = args.length > 1 ? args : ["bundle", args[0]];
  switch (cmd) {
    case "bundle": {
      return bundle({ ...options, input });
    }
    case "lint": {
      console.log("WIP");
      return;
    }
    case "pack": {
      console.log("WIP");
      return;
    }
  }
}

const cli = meow(
  `
    Usage
      $ uniroll <input>

    Options
      --out, -o
      --oudir, -d

    Examples
      $ uniroll css
`,
  {
    autoHelp: true,
    flags: {
      config: {
        type: "string",
        alias: "c",
      },
      out: {
        type: "string",
        alias: "o",
      },
      lint: {
        type: "boolean",
        alias: "l",
      },
      type: {
        type: "string",
        alias: "t",
      },
      minify: {
        type: "boolean",
      },
      print: {
        type: "boolean",
        alias: "p",
      },
    },
  }
);

run(cli.input as [string, string], cli.flags as any);
