const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const path = require("path");
const { resolve } = require("path");
const config = require("../config");
const { NODE_ENV } = process.env;

module.exports = merge(common, {
  mode: "development",
  // devtool: 'source-map',
  entry: {
    app: ["./src/dev.ts"]
  },
  output: {
    filename: "[name].bundle.js",
    publicPath: config[NODE_ENV].publicPath
    // path: resolve(__dirname, 'dist') //绝对路径
  },
  module: {
    rules: []
  },
  optimization: {
    // splitChunks: {
    //     chunks: 'all'
    // }
  },
  devServer: {
    publicPath: "/",
    watchOptions: {
      ignored: /node_modules/,
      poll: true
    },
    historyApiFallback: true,
    noInfo: false,
    hot: true,
    compress: true, //配置是否启用 Gzip 压缩 ，
    port: config[NODE_ENV].port
  },
  plugins: [
    // new webpack.NamedModulesPlugin(),
    // new webpack.HotModuleReplacementPlugin() // 热模块替换插件
  ]
});
