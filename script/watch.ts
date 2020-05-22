import path from "path";
import fs from "graceful-fs";
import { execSync } from "child_process";

const root = path.join(__dirname, "../templates/src");

fs.watch(
  root,
  {
    persistent: true,
    recursive: true,
  },
  (type: string, filename: string) => {
    const absPath = path.join(root, filename);
    // if (filename.startsWith("src")) {
    if (fs.existsSync(absPath)) {
      const ret = execSync("yarn ts-node -T script/gen-template-dump.ts", {
        cwd: process.cwd(),
      }).toString();
      console.log(absPath);
    }
    // }
  }
);

// const Watchpack = require("watchpack");
// const wp = new Watchpack({
//   aggregateTimeout: 1000,
//   poll: true,
//   followSymlinks: true,
//   ignored: "**/.git",
// });

// wp.on("change", function (filePath, mtime, explanation) {
//   console.log("change", filePath, mtime, explanation);
//   // filePath: the changed file
//   // mtime: last modified time for the changed file
//   // explanation: textual information how this change was detected
// });

// wp.on("remove", function (filePath, explanation) {
//   console.log("remove", filePath, explanation);
//   // filePath: the removed file or directory
//   // explanation: textual information how this change was detected
// });

// wp.on("aggregated", function (changes, removals) {
//   console.log("aggregated", changes, removals);
//   // changes: a Set of all changed files
//   // removals: a Set of all removed files
//   // watchpack gives up ownership on these Sets.
// });

// // wp.on("change", (x, y, z) => {
// //   console.log("changed", x, y, z);
// // });

// wp.watch([], [path.join(__dirname, "../templates")]);
