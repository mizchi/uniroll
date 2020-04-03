// TODO
import "isomorphic-unfetch";
import path from "path";
import glob from "glob";
import { compile } from "uniroll";
import fs from "fs";
import meow from "meow";
import { optimizeJs } from "uniroll-optimizer";
import { lint as linter } from "uniroll-linter";

function createMemoryObject(cwd: string, baseDirectory: string) {
  const files = glob.sync(`${baseDirectory}/**`, {
    root: cwd,
    cwd: cwd,
    nodir: true
  });
  const fileMap = files.reduce((acc, fname) => {
    const content = fs.readFileSync(path.join(process.cwd(), fname));
    const pathname = path.join("/", fname);
    return { ...acc, [pathname]: content.toString() };
  }, {});
  return fileMap;
}

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
  switch (options.type || "local") {
    case "memory": {
      const target = path.join(process.cwd(), input);
      const dirname = path.basename(path.dirname(target));
      const files = createMemoryObject(process.cwd(), dirname);
      const bundle = await compile({
        useInMemory: true,
        files,
        input: target
      });
      const out = await bundle.generate({ format: "esm" });
      console.log(out.output[0]);
      break;
    }
    case "local": {
      const output = await compile({
        useInMemory: false,
        input: input,
        cwd: process.cwd(),
        fs: fs.promises
      });
      // console.log(out);
      const { type, out, outdir, minify, print, lint, ...others } = options;
      const o = await output.generate(others);
      if (print) {
        for (const i of o.output) {
          if (i.type === "chunk") {
            console.log(`// ${i.fileName}\n${i.code}`);
          }
        }
      } else {
        if (outdir) {
          try {
            fs.mkdirSync(path.join(process.cwd(), outdir));
          } catch (err) {}
        }
        for (const i of o.output) {
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
              // console.log(`// ${i.fileName}\n${i.code}`);
            }
          }
        }
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
    flags: {
      lint: {
        type: "boolean",
        alias: "l"
      },
      type: {
        type: "boolean",
        alias: "t"
      },
      minify: {
        type: "boolean"
      },
      print: {
        type: "boolean",
        alias: "p"
      }
    }
  }
);

run(cli.input[0], cli.flags as any);

// build({ type: "local", input: "example_src/index.js" });
