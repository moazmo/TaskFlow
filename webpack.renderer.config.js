const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  target: 'web',
  entry: './src/renderer.tsx',
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    fallback: {
      "path": false,
      "fs": false,
      "crypto": false,
      "stream": false,
      "buffer": false,
      "util": false,
      "process": false,
      "os": false
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|\.webpack)/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: 'tsconfig.renderer.json',
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },  plugins: [
    new webpack.DefinePlugin({
      'global': 'globalThis',
    }),
    new ForkTsCheckerWebpackPlugin({
      logger: 'webpack-infrastructure',
      typescript: {
        configFile: 'tsconfig.renderer.json',
      },
    }),  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    fallback: {
      "path": false,
      "fs": false,
      "crypto": false,
      "stream": false,
      "buffer": false,
      "util": false
    }
  },
};
