const path = require('path');

const ROOT_DIR = path.resolve(__dirname);
const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(APP_DIR, 'index.js'),
  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/react' ]
          }
        },
        exclude: /node_modules/,
        exclude: path.resolve(ROOT_DIR, 'app.js')
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /freesasa.wasm$/,
        type: 'javascript/auto',
        loaders: ['file-loader']
      }
    ]
  },
  resolve: {
      extensions: [".js", ".jsx"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(APP_DIR, 'index.html'),
      inject: 'body',
      title: 'production'
    }),
    new CleanWebpackPlugin(['dist']),
    new ManifestPlugin(),
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  node: {
    fs: 'empty'
  }
}
