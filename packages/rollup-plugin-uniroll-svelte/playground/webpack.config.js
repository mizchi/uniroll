const webpack = require("webpack");
const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
module.exports = {
  entry: path.join(__dirname, "index.ts"),
  resolve: {
    alias: {
      // process: "process/browser.js",
      rollup: "rollup/dist/es/rollup.browser.js",
      path: "path-browserify",
    },
    extensions: [".js", ".ts", ".tsx", ".json", ".wasm"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
      {
        test: /\.js$/,
        include: /pluginutils/, // for @rollup/pluginutils
        type: "javascript/auto",
      },
    ],
  },
  plugins: [
    new HtmlPlugin(),
    // new webpack.ProvidePlugin({
    //   process: "process/browser",
    // }),
  ],
};
