const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const glob = require("glob");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: "./src/js/app.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/app.bundle.js",
      clean: true,
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: true,
      port: 3000,
      open: true,
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.(s[ac]ss|css)$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "postcss-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico|eot|ttf|woff)$/i,
          type: "asset/resource",
          generator: {
            filename: "images/[name][ext]",
          },
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".js"],
    },
    plugins: [
      ...glob.sync("./src/**/*.html").map((file) => {
        return new HtmlWebpackPlugin({
          template: file,
          filename: path.basename(file),
        });
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
      }),

      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "css/app.min.css",
            }),
            new ImageMinimizerPlugin({
              minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                  plugins: [
                    ["mozjpeg", { quality: 75 }],
                    ["pngquant", { quality: [0.65, 0.9], speed: 4 }],
                    ["svgo", { removeViewBox: false }],
                    ["gifsicle", { interlaced: true }],
                  ],
                },
              },
            }),
          ]
        : []),
    ],
    mode: isProduction ? "production" : "development",
  };
};
