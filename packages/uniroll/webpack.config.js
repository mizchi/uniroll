// for modern browser
const path = require("path");

module.exports = {
  resolve: {
    alias: {
      rollup: "rollup/dist/rollup.browser.js"
    },
    extensions: [".js", ".mjs", ".ts", ".tsx", ".json"]
  },
  entry: {
    uniroll: path.join(__dirname, "index")
  },
  output: {
    library: "uniroll",
    libraryTarget: "umd",
    filename: "[name].js",
    globalObject: "globalThis",
    path: path.join(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  },
  node: {
    fs: "empty",
    module: "empty",
    dns: "empty",
    net: "empty",
    tls: "empty"
  }
};
