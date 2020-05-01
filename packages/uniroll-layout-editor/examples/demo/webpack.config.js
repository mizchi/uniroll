const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
// @ts-ignore
const WorkerPlugin = require("worker-plugin");

module.exports = {
  entry: path.join(__dirname, "index.tsx"),
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
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
    ],
  },
  plugins: [new HTMLPlugin(), new WorkerPlugin()],
};
