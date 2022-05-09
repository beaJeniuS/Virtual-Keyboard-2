const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === "development"; // определяет режим сборки , dev  или prod
const isProd = !isDev;

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`); // в зависимости от режима разработки меняет имена файлов ( если dev - обычные, prod - с хэшами)

const optimization = () => {
    let config = {
        splitChunks: {
            chunks: "all",
        },
    };
    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin(),
        ];
    }
    return config;
};

module.exports = {
    context: path.resolve(__dirname, "src"),
    //  mode: 'development',
    entry: {
        main: "./index.js",
        //  analytics: './analytics.js',
    },
    output: {
        filename: filename("js"),
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./index.html",
            inject: "body",
            minify: {
                collapseWhitespace: isProd,
            },
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, "src/assets/favicon.ico"),
                to: path.resolve(__dirname, "dist"),
            }, ],
        }),
        new MiniCssExtractPlugin({
            filename: filename("css"),
        }),
    ],
    optimization: optimization(),
    devServer: {
        hot: isDev,
        liveReload: true,
        port: 4200,
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            //  reloadAll: true,
                        },
                    },
                    "css-loader",
                ],
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ["file-loader"],
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ["file-loader"],
            },
            {
                test: /\.xml$/,
                use: ["xml-loader"],
            },
            {
                test: /\.s[ac]ss$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            //  reloadAll: true,
                        },
                    },
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
    },
};