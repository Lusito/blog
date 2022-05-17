const { merge } = require("webpack-merge");

module.exports = (config) => {
    return merge(config, {
        module: {
            rules: [
                {
                    test: /\.module\.css$/,
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
                    ],
                },
            ],
        },
    });
};
