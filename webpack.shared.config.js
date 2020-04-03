module.exports = {
  resolve: {
    alias: {
      rollup: "rollup/dist/rollup.browser.js",
      path: "path-browserify",
      stream: "stream-browserify",
      fs: false,
      net: false,
      dns: false
    },
    extensions: [".js", ".mjs", ".ts", ".tsx", ".json"]
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
  }
};
