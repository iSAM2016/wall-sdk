const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const rootPath = path.resolve(__dirname, "../");
// const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const { NODE_ENV } = process.env;

module.exports = merge(common, {
  // 如果方式是prod 模式，默认会开启 uglifyjs assetsCssPlugin ，如果主动声明 optimization。 则需要配置  uglifyjs assetsCssPlugin
  mode: "production",
  entry: {
    app: "./src/index.ts"
  },
  output: {
    filename: "static/[name].js",
    path: path.resolve(__dirname, `../dist`),
    chunkFilename: "[name].bundle.js"
  },
  module: {},

  externals: {},
  //4.0配置
  // optimization: {
  // 提取公共代码
  // splitChunks: {
  //     cacheGroups: {// 提起公共的模块（第三方）， 有vender 来决定， 在单页面的情况下，我们写的公共代码也不会重复引用，但是在多页面会被重复引用
  //         commons: {
  //             test: /[\\/]node_modules[\\/]/,
  //             name: "vendor",// 但是每次vvendor 每次都会变化hash 我们不希望它变化,  所以我们使用dell, 并且webpack
  //             chunks: "all"
  //         }
  //     }
  // },
  // minimizer: [
  //     new UglifyJsPlugin({
  //         cache: true,//启动缓存
  //         parallel: true,//启动并行压缩
  //         //如果为true的话，可以获得sourcemap
  //         sourceMap: true // set to true if you want JS source maps
  //     }),
  //     //压缩css资源的
  //     new OptimizeCSSAssetsPlugin({})
  // ]
  // },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ]
});
