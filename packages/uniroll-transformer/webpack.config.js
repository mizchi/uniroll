const path = require("path");
const shared = require("../../webpack.shared.config");
module.exports = {
  ...shared,
  entry: {
    "uniroll-transformer": path.join(__dirname, "src/createTransformer"),
  },
  output: {
    library: "UnirollTransfomer",
    libraryTarget: "umd",
    filename: "[name].js",
    globalObject: "globalThis",
    path: path.join(__dirname, "dist"),
  },
};
