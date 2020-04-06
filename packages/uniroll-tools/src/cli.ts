import "isomorphic-unfetch";
import path from "path";
import glob from "glob";
import { compile } from "uniroll";
import fs from "fs";
import meow from "meow";
import { RollupOutput } from "rollup";
import { optimizeJs } from "uniroll-optimizer";
import { lint as linter } from "uniroll-linter";

async function run(
  input: string,
  options: {
    type: "memory" | "local";
    print?: boolean;
    out?: string;
    outdir?: string;
    minify?: boolean;
    lint?: boolean;
  }
) {
  const { type, out, outdir, minify, print, lint, ...others } = options;

  let output: RollupOutput;
  switch (options.type || "local") {
    case "memory": {
      const bundle = await bundleOnMemory(input);
      output = await bundle.generate(others);
      break;
    }
    case "local": {
      const bundle = await compile({
        useInMemory: false,
        input: input,
        cwd: process.cwd(),
        fs: fs.promises,
      });
      output = await bundle.generate(others);
      break;
    }
  }

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

async function bundleOnMemory(input: string) {
  const entry = path.join(process.cwd(), input);
  const basename = path.basename(entry);
  const globdir = path.basename(path.dirname(entry));
  const files = glob.sync(`${globdir}/**`, {
    root: process.cwd(),
    cwd: process.cwd(),
    nodir: true,
  });
  const fileMap = files.reduce((acc, fname) => {
    const content = fs.readFileSync(path.join(process.cwd(), fname));
    const pathname = path.join(
      "/",
      fname.replace(new RegExp(`^(${globdir})`), "")
    );
    return { ...acc, [pathname]: content.toString() };
  }, {});
  return await compile({
    useInMemory: true,
    files: fileMap,
    input: basename,
  });
}

run(cli.input[0], cli.flags as any);
