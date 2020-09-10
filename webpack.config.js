/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-09-10 09:50:34
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-10 13:16:06
 */
const path = require("path");

const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = [
  {
    mode: "development",
    context: __dirname,
    entry: {
      app: "./src/index.js",
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
    },
    devtool: "eval",
    node: {
      // Resolve node module use of fs
      fs: "empty",
      Buffer: false,
      http: "empty",
      https: "empty",
      zlib: "empty",
    },
    resolve: {
      mainFields: ["module", "main"],
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
          use: ["url-loader"],
        },
      ],
    },
    plugins: [
      // Copy Cesium Assets, Widgets, and Workers to a static directory
      new CopyWebpackPlugin({
        patterns: [
          { from: "node_modules/cesium/Build/Cesium/Workers", to: "Workers" },
          {
            from: "node_modules/cesium/Build/Cesium/ThirdParty",
            to: "ThirdParty",
          },
          { from: "node_modules/cesium/Build/Cesium/Assets", to: "Assets" },
          { from: "node_modules/cesium/Build/Cesium/Widgets", to: "Widgets" },
        ],
      }),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify(""),
      }),
    ],

    // development server options
    devServer: {
      contentBase: path.join(__dirname, "dist"),
    },
  },
];
