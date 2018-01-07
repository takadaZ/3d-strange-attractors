module.exports = {
  // メインのJS
  // entry: "index.js",
  output: {
    filename: "bundle.js"
  },
  resolve: {
    root:[require('path').join(__dirname, 'node_modules')],
    extensions:['', '.ts', '.webpack.js', '.web.js', '.js']
  },
}
