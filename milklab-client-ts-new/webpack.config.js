const path = require('path');

const getTransformer = require('ts-transform-graphql-tag').getTransformer;

module.exports = {
    entry: "./src/index.tsx",
    devtool: "source-map",
    devServer: {
        contentBase: "./public",
        hot: true,
        historyApiFallback: {
            index: 'index.html'
        }
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "awesome-typescript-loader",
                options: {
                    getCustomTransformers: () => ({ before: [getTransformer()] })
                }
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.less$/,
                loader: "less-loader", options: {
                    sourceMap: true
                }

            },
            {
                test: /\.(eot|woff|ttf)$/,
                loader: 'url-loader'
            },
            {
                test: /\.(graphql)$/,
                loader: 'graphql-tag/loader'
            }
        ]
    }
};