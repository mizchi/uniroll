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
  resolve: {
    ...shared.resolve,
    alias: {
      ...shared.resolve.alias,
      process: false,
      fs: false,
      "css-blank-pseudo/postcss": "css-blank-pseudo/postcss.js",
      "css-has-pseudo/postcss": "css-has-pseudo/postcss.js",
      "css-prefers-color-scheme/postcss": "css-prefers-color-scheme/postcss.js",
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
