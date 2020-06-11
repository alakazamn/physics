/*
  Undoubtedly, this came from the internet.
  Where, I don't know. I don't want to take credit for it, though.
*/
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const {
  NODE_ENV = 'development',
} = process.env;

const clientConfig = {
  entry: {
    client: './src/main.ts'
  },
  mode: NODE_ENV,
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(gif|svg|jpg|png)$/,
        loader: "url-loader",
            options: {
              esModule: false,
            },
      },
    ]
  },
  target: 'web'
}


module.exports = [clientConfig]
