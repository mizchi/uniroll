const path = require("path");
const config = require("./webpack.config")
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
  ...config,
  mode: "development",
  entry: {
    main: path.join(__dirname, "src/run.tsx")
  },
  output: {
    path: path.join(__dirname, "demo"),
    globalObject: "globalThis",
    filename: "[name].js",
    chunkFilename: "[name].[id].[contenthash].js"
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json", ".mjs", ".wasm"]
  },
  externals: [],
  plugins: [...config.plugins, new HtmlPlugin({
    template: path.join(__dirname, "src/index.html")
  })]
};
