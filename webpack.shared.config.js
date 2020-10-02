const path = require("path");
module.exports = {
  resolve: {
    alias: {
      // process: "process/browser",
      process: false,
      fs: false,
      rollup: "rollup/dist/rollup.browser.js",
      path: "path-browserify",
      // url: path.join(__dirname, "shim/url.js"),
      url: "url",
      stream: "stream-browserify",
      querystring: "querystring-es3",
    },
    extensions: [".js", ".mjs", ".ts", ".tsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
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
  // node: {
  //   fs: "empty",
  //   net: "empty",
  //   dns: "empty",
  //   net: "empty"
  // }
};
