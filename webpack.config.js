const path = require('path');
const nodeExternals = require('webpack-node-externals');

const {
  NODE_ENV = 'development',
} = process.env;

const clientConfig = {
  entry: {
    client: './src/client.ts'
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
