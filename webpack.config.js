const path = require('path');

const ROOT_DIR = path.resolve(__dirname);
const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.resolve(APP_DIR, 'index.html'),
  inject: 'body'
})

const config = {
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
    HtmlWebpackPluginConfig
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.resolve('public')
  },
  node: {
    fs: 'empty'
  }
}

module.exports = config