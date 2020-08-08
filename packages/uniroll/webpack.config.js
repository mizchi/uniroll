const path = require("path");
const shared = require("../../webpack.shared.config");
module.exports = {
  ...shared,
  entry: {
    "uniroll-transformer": path.join(__dirname, "src/transformer"),
    // "uniroll-baseline": path.join(__dirname, "src/baseline"),
    // "uniroll-prod": path.join(__dirname, "src/prod"),
    uniroll: path.join(__dirname, "src/index"),
  },
  output: {
    library: "uniroll",
    libraryTarget: "umd",
    filename: "[name].js",
    globalObject: "globalThis",
    path: path.join(__dirname, "dist"),
  },
};
