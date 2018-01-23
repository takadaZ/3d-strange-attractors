const webpack = require('webpack');
const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js"
  },
  resolve: {
    alias: {
      'three-examples': path.join(__dirname, 'node_modules/three/examples/js')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      'THREE': 'three/build/three'
    })
  ]
}
