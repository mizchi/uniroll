const path = require("path");
const WorkerPlugin = require("worker-plugin");

module.exports = {
  entry: {
    ui: path.join(__dirname, "src/index.tsx")
  },
  output: {
    library: "unirollUI",
    libraryTarget: "umd",
    globalObject: "globalThis",
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    chunkFilename: "brui-[contenthash].js"
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
  plugins: [new WorkerPlugin()],
  devtool: false
};
