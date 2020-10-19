const path = require("path");

module.exports = {
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },
  entry: path.resolve(__dirname, './index.ts'),
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/'
  },
  resolve: {
    extensions: [".js", ".mjs", ".ts", ".tsx", ".json"],
    alias: {
      "uniroll-vue": "../dist/uniroll-vue.js"
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            happyPackMode: true,
            transpileOnly: true,
            appendTsSuffixTo: [/\.vue$/]
          }
        }
      },
      {
        test: /\.js$/,
        include: /pluginutils/,
        type: "javascript/auto",
      },
    ],
  },
  devServer: {
    inline: true,
    hot: true,
    // stats: "verbose",
    contentBase: __dirname,
    overlay: true
  }
};
