const webpack = require('webpack');
const path = require("path");
const shared = require("../../../webpack.shared.config");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  ...shared,
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
    ...shared.resolve,
    alias: {
      // ...shared.resolve.alias,
      querystring: require.resolve("querystring-browser"),
      consolidate: false,
      '@vue/compiler-core': require.resolve("@vue/compiler-core/dist/compiler-core.cjs.prod.js"),
    },
    fallback: {
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
      fs: false,
    }
  },
  module: {
    ...shared.module,
    rules: [
      ...shared.module.rules,
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
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser.js",
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "index.html")
    }),
  ],
  devServer: {
    inline: true,
    hot: true,
    // stats: "verbose",
    contentBase: __dirname,
    overlay: true
  }
};
