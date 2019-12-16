const os = require('os');
const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
});
const { NODE_ENV } = process.env;
module.exports = {
    resolve: {
        alias: {
            utils: path.resolve(__dirname, '../src/utils'),
            '@types': path.resolve(__dirname, '../src/types'),
            '@app': path.resolve(__dirname, '../src')
            // // 配置webpack 模块寻找目录，为array默认只会去node_modules,
            // modules: [path.resolve(__dirname, './src/components'), 'node_modules'],
        },
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            // All files with a '.ts' or extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.ts?$/,
                use: ['babel-loader', 'ts-loader'],
                exclude: /node_modules/
            },
            //  pre 在正常loader执行前执行
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                // enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                include: path.resolve('src'),
                use: 'happypack/loader?id=js'
            }
        ]
    },
    externals: {},

    plugins: [
        // 项目比较复杂的时候使用
        new HappyPack({
            id: 'js',
            use: [
                {
                    loader: 'babel-loader' //允许 HappyPack 输出日志
                }
            ],
            threadPool: happyThreadPool, //共享进程池
            cache: true,
            verbose: true
        }),
        //  可以约定那个包不在引用了
        //  monent 中的locale 全部不要引入
        //  可以单独引 import  monent/locale/zh_en
        new webpack.IgnorePlugin(/\.\locale/, /moment/),
        new HtmlWebpackPlugin({
            inject: true,
            template: './index.html'
        })
    ]
};
