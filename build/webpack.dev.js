const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = merge(common, {
    mode: 'development',
    entry: {
        app: ['./src/dev.ts']
    },
    output: {
        filename: '[name].bundle.js',
        publicPath: './'
        // path: resolve(__dirname, 'dist') //绝对路径
    },
    module: {
        rules: [
            // All files with a '.ts' or extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.ts?$/,
                use: ['babel-loader', 'ts-loader'],
                exclude: /node_modules/
            }
        ]
    },
    optimization: {
        // splitChunks: {
        //     chunks: 'all'
        // }
    },
    devServer: {
        publicPath: '/',
        watchOptions: {
            ignored: /node_modules/,
            poll: true
        },
        historyApiFallback: true,
        noInfo: false,
        hot: true,
        compress: true, //配置是否启用 Gzip 压缩 ，
        port: 8001
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: './index.html'
        })
        // new webpack.NamedModulesPlugin(),
        // new webpack.HotModuleReplacementPlugin() // 热模块替换插件
    ]
});
