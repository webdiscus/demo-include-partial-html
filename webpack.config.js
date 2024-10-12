const path = require("path");
const webpack = require("webpack");
const HtmlBundlerPlugin = require("html-bundler-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = ({ mode }) => {
  const isProduction = mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    output: {
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    // (best practice) define plugins above modules
    plugins: [
      new HtmlBundlerPlugin({
        // automatically processing all HTML pages in the directory recursively
        //entry: './src/pages', // try it self
        // - OR - define all pages manually
        entry: {
          index: './src/pages/index.html', // => generates dist/index.html
          //'about/index': './src/pages/about/index.html', // => generates dist/about/index.html
          // add here your pages
        },
        js: {
          filename: 'js/[name].[contenthash:8].js', // JS output filename
        },
        css: {
          filename: 'css/[name].[contenthash:8].css', // CSS output filename
        },
      }),

      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
      }),
      ...(isProduction
        ? [
            new ImageMinimizerPlugin({
              minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                  plugins: [
                    ['mozjpeg', { quality: 75 }],
                    ['pngquant', { quality: [0.65, 0.9], speed: 4 }],
                    ['svgo', { removeViewBox: false }],
                    ['gifsicle', { interlaced: true }],
                  ],
                },
              },
            }),
          ]
        : []),
    ],
    module: {
      rules: [
        {
          test: /\.(s[ac]ss|css)$/i,
          use: [
            "css-loader",
            "postcss-loader",
            "sass-loader",
          ],
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
      alias: {
        // (best practice) webpack aliases can be used in HTML, SCSS, JS to avoid relative paths like `../../images/`
        '@images': path.join(__dirname, 'src/images'),
        '@scripts': path.join(__dirname, 'src/js'),
        '@styles': path.join(__dirname, 'src/scss'),
      },
      extensions: ['.js'],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      // watch source files for changes by live reload
      watchFiles: {
        paths: ['src/**/*.*'],
        options: {
          usePolling: true,
        },
      },
      compress: true,
      port: 3000,
      open: true,
      hot: true,
    },
  };
};