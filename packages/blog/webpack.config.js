// eslint-disable-next-line import/no-extraneous-dependencies
const { merge } = require("webpack-merge");

module.exports = (config) =>
    merge(config, {
        output: {
            assetModuleFilename: "assets/[hash][ext][query]",
        },
        module: {
            rules: [
                {
                    test: /\.(woff|woff2|png|jpe?g|svg|webp)$/,
                    // "asset" will use data-uri for small images.
                    // "asset/resource" will always make it external,
                    // "asset/inline" will always make a data-uri
                    type: "asset/resource",
                },
                {
                    test: /\.module\.s?css$/,
                    use: [
                        { loader: "isomorphic-style-loader" },
                        {
                            loader: "css-loader",
                            options: {
                                esModule: false,
                                modules: {
                                    localIdentName: "[local]--[hash:base64]",
                                    exportLocalsConvention: "camelCaseOnly",
                                },
                                sourceMap: false,
                                importLoaders: 1,
                            },
                        },
                        "sass-loader",
                    ],
                },
            ],
        },
    });
