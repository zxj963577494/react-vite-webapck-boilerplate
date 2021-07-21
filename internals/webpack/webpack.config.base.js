const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const FirendlyErrorePlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const appSrc = path.join(process.cwd(), 'src');

const isEslint = process.env.ESLINT == 'true';

module.exports = (options) => {
  const isProduction = options.mode === 'production';
  const base = {
    mode: options.mode,
    entry: options.entry,
    output: Object.assign(
      {
        // Compile into js/build.js
        path: path.join(process.cwd(), 'dist'),
        publicPath: '/',
      },
      options.output
    ), // Merge with env dependent settings
    optimization: options.optimization,
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: options.babelQuery,
          },
        },
        {
          test: /\.(le|c)ss$/,
          exclude: /node_modules/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  localIdentName: '[local]__[hash:base64:5]',
                },
              },
            },
            'postcss-loader',
            'less-loader',
          ],
        },
        {
          test: /\.(eot|otf|ttf|woff|woff2|svg)$/,
          type: 'asset/resource',
        },
        {
          test: /\.(jpg|png|gif)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024, //超过10kb不转base64
            },
          },
        },
      ],
    },
    plugins: options.plugins.concat([
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
      }),
      new ProgressBarPlugin(),
      new FirendlyErrorePlugin(),
    ]),
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      alias: {
        '@': path.join(process.cwd(), 'src'),
      },
    },
    devtool: options.devtool,
    target: 'web',
    stats: { errorDetails: true },
    performance: options.performance || {},
  };

  if (isEslint) {
    base.module.rules.unshift({
      test: /\.jsx?$/,
      enforce: 'pre',
      use: [
        {
          loader: require.resolve('eslint-loader'),
        },
      ],
      include: appSrc,
      exclude: '/node_modules/',
    });
  }

  return base;
};
