const path = require("path");
module.exports = {
  entry: {
    main: path.join(__dirname, "index")
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: [".mjs", ".js", ".json", ".ts", ".tsx"]
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
  },
  plugins: []
};
