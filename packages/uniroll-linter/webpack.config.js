// for modern browser
const path = require("path");
const shared = require("../../webpack.shared.config");

module.exports = {
  ...shared,
  entry: {
    "uniroll-linter": path.join(__dirname, "src/index")
  },
  output: {
    library: "UnirollLinter",
    libraryTarget: "umd",
    filename: "[name].js",
    globalObject: "globalThis",
    path: path.join(__dirname, "dist")
  }
};
