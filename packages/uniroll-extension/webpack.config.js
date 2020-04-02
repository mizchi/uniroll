const path = require("path");
const WorkerPlugin = require("worker-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    devtools: path.join(__dirname, "src/devtools.ts"),
    popup: path.join(__dirname, "src/popup.ts"),
    panel: path.join(__dirname, "src/panel.tsx"),
    options: path.join(__dirname, "src/options.ts"),
    background: path.join(__dirname, "src/background.ts")
  },
  output: {
    globalObject: "globalThis",
    path: path.join(__dirname, "build"),
    filename: "[name].js",
    chunkFilename: "[name].[id].[contenthash].js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true
          }
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json", ".mjs", ".wasm"]
  },
  plugins: [
    new WorkerPlugin(),
    new CopyWebpackPlugin([
      {
        from: "assets/*",
        flatten: true
      }
    ])
    // new CopyWebpackPlugin([
    //   {
    //     from: "../packages/uniroll-ui/dist",
    //     flatten: true
    //   }
    // ])
  ]
};
