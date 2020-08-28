import path from "path";
import glob from "glob";
import fs from "fs";

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
  return fileMap;
  // return await compile({
  //   files: fileMap,
  //   input: basename,
  // });
}
