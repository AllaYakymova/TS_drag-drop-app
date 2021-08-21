const path = require('path');

module.exports = {
  mode: "development",
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist' // ? webpack-dev-server doesn't work
  },
  devtool: 'inline-source-map',
  //what to do with ts files
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts','.js']
  },
};
