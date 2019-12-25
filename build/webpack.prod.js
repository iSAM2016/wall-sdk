const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    // 如果方式是prod 模式，默认会开启 uglifyjs assetsCssPlugin ，如果主动声明 optimization。 则需要配置  uglifyjs assetsCssPlugin
    mode: 'production',
    entry: {
        app: './src/index.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, `../dist`),
        chunkFilename: '[name].bundle.js'
    },
    module: {},

    externals: {},
    //4.0配置
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
});
