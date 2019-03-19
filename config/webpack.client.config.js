/**
 * Author: Zhou Ht
 * Date: 2018/11/28 0028
 * Time: 23:35
 *
 */
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const theme = require('../package.json').theme
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config')
const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

const clientConfig = {
    entry: path.join(__dirname, '../src/client/index.js'),
    output: {
        path: path.join(__dirname, '../public'),
        filename: 'static/js/client.[hash:5].js',
        chunkFilename: "static/js/[name].js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            }
        ]
    },
    devtool: "#eval-source-map",
    plugins: []
}

if(isDev) {
    const devRules = [
        {
            test: /\.less$/,
            use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' },
                { loader: 'postcss-loader' },
                {
                    loader: 'less-loader',
                    options: {
                        modifyVars: theme,
                        javascriptEnabled: true
                    }
                },

            ]
        },
    ]
    clientConfig.entry = [
        "react-hot-loader/patch",
        path.join(__dirname, '../src/client/index.js'),
    ]
    clientConfig.output = {
        path: path.join(__dirname, '../dev-public'),
        filename: '[name].client.js',
        chunkFilename: "[name].js",
    }
    clientConfig.mode = 'development'
    clientConfig.module.rules = clientConfig.module.rules.concat(devRules)
    clientConfig.devServer = {
        host: '0.0.0.0',
        port: '9001',
        inline: true,
        overlay: {
            error: true,
        },
        contentBase: path.join(__dirname, '../dev-public'),
        historyApiFallback: true,
        hot: true,
    }
    clientConfig.plugins = clientConfig.plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'music',
            filename: path.join(__dirname, '../dev-public/index.html'),
            template: path.join(__dirname, '../dev-public/index.html'),
            inject: true,
        }),
        ]
    )
}
if(isProd) {
    const prodRules = [
        {
            test: /\.less$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '../../'
                    }
                },
                { loader: 'css-loader' },
                { loader: 'postcss-loader' },
                {
                    loader: 'less-loader',
                    options: {
                        modifyVars: theme,
                        javascriptEnabled: true
                    }
                },


            ]
        },
    ]
    clientConfig.mode = 'production'
    clientConfig.module.rules = clientConfig.module.rules.concat(prodRules)

    clientConfig.optimization = {
        minimizer: [new UglifyJsPlugin()],
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    priority: -20,
                    chunks: "all"
                }
            }
        }
    }

    clientConfig.plugins = clientConfig.plugins.concat([
        new MiniCssExtractPlugin({
            filename: "static/css/[name].css",
            // chunkFilename: "static/css/style.[id].css",
            // allChunks: true
        }),
        new HtmlWebpackPlugin({
            title: '周海涛的个人网',
            filename: path.join(__dirname, '../public/static/index.html'),
            template: path.join(__dirname, '../dev-public/index.html'),
            favicon: path.join(__dirname, '../dev-public/favicon2.ico'),
        })
        ]
    )

}
module.exports = merge(baseConfig, clientConfig)
