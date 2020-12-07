const webpack = require('webpack');
const path = require('path');

const MODE = 'development';

module.exports = {
  mode: MODE,
  entry: {
    index: './ts/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'three-examples': path.resolve(__dirname, 'node_modules/three/examples/js')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      THREE: 'three/build/three'
    })
  ],
  cache: true,
}
