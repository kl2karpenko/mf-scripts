const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const usersBabel = path.resolve(process.cwd(), '.babelrc.js');
// eslint-disable-next-line import/no-dynamic-require
const babelrc = require(usersBabel);

const config = {
  mode: 'development',
  entry: {
    app: path.resolve(process.cwd(), 'public/index.tsx')
  },
  output: {
    path: path.resolve(process.cwd(), 'dist')
  },
  devServer: {
    contentBase: './dist',
    hot: true,
    historyApiFallback: true
  },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.json']
  },
  devtool: 'eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), 'public/index.html'),
      filename: './index.html',
      minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeEmptyAttributes: true
      },
      publicPath: '/'
    }),
    // run ts type checker in a separate process for faster builds
    new ForkTsCheckerWebpackPlugin(),

    // compression output bundles for file size
    new CompressionPlugin()
  ],
  module: {
    rules: [
      // transpile js and jsx to es5
      {
        test: [/\.jsx?$/],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            ...babelrc
          }
        }
      },
      // handle images
      {
        test: /\.(png|svg|jpg|gif)$/,
        // exclude: /(?!node_modules\/@ayx)(node_modules)/,
        use: ['file-loader']
      },
      // transpile ts and tsx to esnext then to es5 with babel
      {
        test: [/\.tsx?$/],
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              ...babelrc
            }
          },
          {
            loader: 'ts-loader',
            options: {
              context: process.cwd(),
              configFile: path.resolve(process.cwd(), 'tsconfig.json'),
              transpileOnly: true
            }
          }
        ]
      },
    ],
  },
};

module.exports = config;
