var webpack = require('webpack');
var path = require('path');

const TARGET = process.env.npm_lifecycle_event;
console.log("target event is " + TARGET);

var outputFileName = "nested.datatables";
outputFileName += (TARGET == 'prod' ? ".min.js" : ".js");

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: outputFileName,
    library: 'lib',
    libraryTarget:'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader?presets[]=es2015'
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(eot|ttf|svg|gif|png)$/,
        loader: "url-loader"
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    })
  ]
};
