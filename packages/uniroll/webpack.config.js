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
    "uniroll-baseline": path.join(__dirname, "src/baseline"),
    "uniroll-prod": path.join(__dirname, "src/prod"),
    uniroll: path.join(__dirname, "src/index")
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
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      },
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
