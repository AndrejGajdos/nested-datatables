var webpack = require('webpack');
var path = require('path');
const webpackMerge = require('webpack-merge');
const CompressionPlugin = require('compression-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
console.log("target event is " + TARGET);

var outputFileName = "nested.tables";
outputFileName += (TARGET == 'prod' ? ".min.js" : ".js");

const common = {
  entry: {
    main: ['@babel/polyfill', './index.js'],
  }, 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: outputFileName,
    library: 'nestedTables',
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

if (TARGET === 'build' || !TARGET) {
  module.exports = webpackMerge(common, {
    devtool: 'source-map',
    watchOptions: {
      poll: true,
    },
  });
}

if (TARGET === 'prod' || !TARGET) {
  module.exports = webpackMerge(common, {
    plugins: [
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        compress: {
          warnings: false, // Suppress uglification warnings
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
        },
        output: {
          comments: false,
        },
        exclude: [/\.min\.js$/gi], // skip pre-minified libs
      }),
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0,
      }),
    ],
  });
}
