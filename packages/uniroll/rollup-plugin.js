// patch
module.exports = {
  name: "uniroll-self-builder",
  // resolveId(id) {
  //   if (id === "rollup") {
  //     return "rollup/dist/es/rollup.browser.js";
  //   }
  // },
  transform(code, id) {
    if (id.endsWith("typescript.js")) {
      return code
        .replace(/require\("perf_hooks"\)/, "{}")
        .replace(/require\("inspector"\)/, "{}");
    }
    return;
  },
};
