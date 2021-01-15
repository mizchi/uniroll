const path = require("path");
const shared = require("../../webpack.shared.config");
module.exports = {
  ...shared,
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },
  module: {
    ...shared.module,
    rules: [
      ...shared.module.rules,
      {
        test: /\.js$/,
        include: /pluginutils/,
        type: "javascript/auto",
      },
    ],
  },
  entry: {
    "uniroll-svelte": path.join(__dirname, "src"),
  },
  output: {
    library: "UnirollSvelte",
    libraryTarget: "umd",
    filename: "[name].js",
    globalObject: "globalThis",
    path: path.join(__dirname, "dist"),
  },
};
