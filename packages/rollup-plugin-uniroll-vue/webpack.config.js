const webpack = require('webpack');
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
      querystring: require.resolve("querystring-browser"),
      consolidate: false,
      '@vue/compiler-core': require.resolve("@vue/compiler-core/dist/compiler-core.cjs.prod.js"),
    },
    fallback: {
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
      fs: false,
    }
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
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser.js",
    }),
  ],
  entry: {
    "uniroll-vue": path.join(__dirname, "src"),
  },
  output: {
    library: "UnirollVue",
    libraryTarget: "umd",
    filename: "[name].js",
    globalObject: "globalThis",
    path: path.join(__dirname, "dist"),
  },
};
