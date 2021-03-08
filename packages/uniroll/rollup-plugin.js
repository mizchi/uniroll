// patch typescript
module.exports = (_opts) => ({
  name: "uniroll-self-builder",
  transform(code, id) {
    if (id.endsWith("typescript.js")) {
      return code
        .replace(/require\("perf_hooks"\)/, "{}")
        .replace(/require\("inspector"\)/, "{}");
    }
    return;
  },
});
