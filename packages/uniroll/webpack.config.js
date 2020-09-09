const path = require("path");
const shared = require("../../webpack.shared.config");
module.exports = {
  ...shared,
  module: {
    rules: [
      {
        test: /\.ts/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              configFile: "tsconfig.webpack.json",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    ...shared.resolve,
    alias: {
      ...shared.resolve.alias,
      "rollup-plugin-http-resolve": "rollup-plugin-http-resolve/src",
      "rollup-plugin-memfs": "rollup-plugin-memfs/src",
      "rollup-plugin-uniroll-css": "rollup-plugin-memfs/src",
    },
  },
  entry: {
    uniroll: path.join(__dirname, "src"),
  },
  output: {
    library: "Uniroll",
    libraryTarget: "umd",
    filename: "[name].js",
    globalObject: "globalThis",
    path: path.join(__dirname, "dist"),
  },
};
