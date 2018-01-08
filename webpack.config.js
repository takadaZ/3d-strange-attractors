const path = require('path');

module.exports = {
  // メインのJS
  // entry: "index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js"
  }
}
