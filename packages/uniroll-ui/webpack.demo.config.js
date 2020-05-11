const path = require("path");
const config = require("./webpack.config");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
  ...config,
  mode: "development",
  entry: {
    "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
    "json.worker": "monaco-editor/esm/vs/language/json/json.worker",
    "css.worker": "monaco-editor/esm/vs/language/css/css.worker",
    "html.worker": "monaco-editor/esm/vs/language/html/html.worker",
    "ts.worker": "monaco-editor/esm/vs/language/typescript/ts.worker",
    main: path.join(__dirname, "src/run.tsx"),
  },
  output: {
    path: path.join(__dirname, "demo"),
    globalObject: "self",
    filename: "[name].js",
    chunkFilename: "[name].[id].[contenthash].js",
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json", ".mjs", ".wasm"],
  },
  externals: [],
  plugins: [
    ...config.plugins,
    new HtmlPlugin({
      template: path.join(__dirname, "src/index.html"),
    }),
  ],
};
