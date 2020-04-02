// TODO
import "isomorphic-unfetch";
import path from "path";
import glob from "glob";
import { compile } from "uniroll";
import fs from "fs";
import meow from "meow";

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
      const { type, out, outdir, print, ...others } = options;
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

            if (out) {
              const outpath = path.join(process.cwd(), out);
              fs.writeFileSync(outpath, i.code);
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
      $ foo <input>
 
    Options
      --rainbow, -r  Include a rainbow
 
    Examples
      $ foo unicorns --rainbow
      🌈 unicorns 🌈
`,
  {
    flags: {
      type: {
        type: "boolean",
        alias: "t"
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
