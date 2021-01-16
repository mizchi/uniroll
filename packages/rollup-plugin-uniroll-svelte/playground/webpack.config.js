const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, "index.ts"),
  resolve: {
    alias: {
      rollup: "rollup/dist/es/rollup.browser.js",
      path: "path-browserify",
      "css-blank-pseudo/postcss": "css-blank-pseudo/postcss.js",
      "css-has-pseudo/postcss": "css-has-pseudo/postcss.js",
      "css-prefers-color-scheme/postcss": "css-prefers-color-scheme/postcss.js",
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
      {
        test: /\.mjs$/,
        include: /node_modules/,
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
