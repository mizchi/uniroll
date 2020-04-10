import fs from "fs";
import path from "path";
import glob from "glob";

const SRC_ROOT = "templates/src";
const OUT_ROOT = "templates/gen";

const result = glob.sync(`${SRC_ROOT}/*`, {
  root: process.cwd(),
  nodir: false,
});

const targets = result.map((r) => r.replace(SRC_ROOT + "/", ""));

// gen/*.json
for (const target of targets) {
  const fileNames = glob
    .sync(path.join(SRC_ROOT, target, "/**"), {
      root: process.cwd(),
      nodir: true,
    })
    .map((r) => r.replace(path.join(SRC_ROOT, target) + "/", ""));
  const files = fileNames.reduce((acc, fpath) => {
    const data = fs.readFileSync(
      path.join(process.cwd(), SRC_ROOT, target, fpath),
      "utf-8"
    );
    return { ...acc, [fpath]: data };
  }, {});

  const outpath = path.join(process.cwd(), OUT_ROOT, `${target}.json`);
  console.log("write >", outpath);

  fs.writeFileSync(
    outpath,
    JSON.stringify({
      files,
      id: target,
      name: target,
    })
  );
}

// gen/list.json
let pkgList: Array<any> = [];
for (const target of targets) {
  try {
    const pkg = fs.readFileSync(
      path.join(process.cwd(), SRC_ROOT, target, "package.json"),
      "utf-8"
    );

    console.log("pkg", target, pkg);

    pkgList.push({
      ...JSON.parse(pkg),
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

console.log("write > list.json", pkgList);
fs.writeFileSync(
  path.join(process.cwd(), OUT_ROOT, "list.json"),
  JSON.stringify(pkgList)
);
