const path = require('path');
const nodeExternals = require('webpack-node-externals');

const {
  NODE_ENV = 'production',
} = process.env;

const clientConfig = {
  entry: {
    client: './client/client.ts'
  },
  mode: NODE_ENV,
  watch: NODE_ENV === 'development',
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
const serverConfig = {
  entry: {
    server: './src/server.ts'
  },
  mode: NODE_ENV,
  watch: NODE_ENV === 'development',
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  }
}

module.exports = [serverConfig, clientConfig]
