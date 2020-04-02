// for modern browser
const path = require("path");

module.exports = {
  resolve: {
    extensions: [".js", ".mjs", ".ts", ".tsx", ".json"]
  },
  entry: {
    "uniroll-linter": path.join(__dirname, "src/index")
  },
  output: {
    library: "UnirollLinter",
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
