const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  target: 'electron-main',
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules|\.webpack)/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: 'tsconfig.main.json',
          },
        },
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      logger: 'webpack-infrastructure',
      typescript: {
        configFile: 'tsconfig.main.json',
      },
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  externals: {
    'better-sqlite3': 'commonjs better-sqlite3'
  },
};
