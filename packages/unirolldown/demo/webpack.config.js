const path = require("path");
const webpack = require("webpack");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
  resolve: {
    alias: {
      rollup: "rollup/dist/es/rollup.browser.js",
      path: "path-browserify",
    },
    extensions: [".js", ".ts", ".tsx", ".json", ".wasm"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        include: /pluginutils/, // for @rollup/pluginutils
        type: "javascript/auto",
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
      {
        test: /yaml\/browser\/dist\/(.*)\.js$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new webpack.DefinePlugin({
      "process.platform": JSON.stringify("browser"),
    }),
    new HtmlPlugin({
      template: path.join(__dirname, "src/index.html"),
    }),
    // new webpack.ProvidePlugin({
    //   process: "process/browser",
    // }),
  ],
};
