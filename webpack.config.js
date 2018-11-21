/**
 * Webpack configuration
 *
 * @author BlockSY team - blocksy@symag.com
 */

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var AppCachePlugin = require('appcache-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var API_URL = {
    production: JSON.stringify("https://blocksy-demo.symag.com/symag/api"),
    development: JSON.stringify("https://blocksy-demo.symag.com/symag/api") //TODO: test on your own server "http://localhost:8080/test/api")
}

module.exports = env => {
  var entry, jsLoaders, plugins, cssLoaders, devtool;

  // If production is true
  if (env && env.prod) {
    process.env.NODE_ENV = 'production';

    console.log("[webpack config] process.env.NODE_ENV="+ process.env.NODE_ENV )

    devtool = false //"source-map";

    // Entry
    entry = [
      'whatwg-fetch',
      path.resolve(__dirname, 'js/app.js') // Start with js/app.js...
    ];

    cssLoaders = ['style-loader', 'css-loader', 'postcss-loader'];

    // Plugins
    plugins = [// Plugins for Webpack
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production'),
          'BABEL_ENV': JSON.stringify('production')
        },
        'COMPIL_API_URL' : API_URL[process.env.NODE_ENV],
        'COMPIL_BUILD' : JSON.stringify(process.env.NODE_ENV)
      }),
      new webpack.optimize.UglifyJsPlugin({ // Optimize the JavaScript...
        compress: { warnings: false },
        comments: false,
        //sourceMap: true,
        //minimize: false
      }),
      new HtmlWebpackPlugin({
        template: 'index.html', // Move the index.html file...
        filename: 'index.html',
        minify: { // Minifying it while it is parsed using the following, self–explanatory options
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
      }),
      new AppCachePlugin({
        exclude: ['.htaccess']
      }),
      new ExtractTextPlugin('css/[name].bundle.css')
    ];

  // If app is in development
  } else {

    process.env.NODE_ENV = 'development';
    console.log("[webpack config] process.env.NODE_ENV="+ process.env.NODE_ENV)
    devtool = 'inline-source-map';

    // Entry
    entry = ['whatwg-fetch',
      path.resolve(__dirname, 'js/app.js') // Start with js/app.js...
    ];

    cssLoaders = ['style-loader', 'css-loader', 'postcss-loader'];

    plugins = [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('development'),
          'BABEL_ENV':  JSON.stringify('development')
        }
      }),
      new webpack.HotModuleReplacementPlugin(), // Make hot loading work
      new AppCachePlugin(),
      new ExtractTextPlugin('css/[name].bundle.css'),
      new webpack.DefinePlugin({
        'COMPIL_API_URL' : API_URL[process.env.NODE_ENV],
        'COMPIL_BUILD' : JSON.stringify(process.env.NODE_ENV)
      })
    ]
  }

  console.log("[webpack config] output directory="+path.resolve(__dirname, env && env.prod ? 'dist' : 'build'))

  return {
    devtool: devtool,
    entry: entry,
    output: { // Compile into js/build.js
      path: path.resolve(__dirname, env && env.prod ? 'dist' : 'build'),
      filename: 'js/bundle.js'
    },
    module: {
      loaders: [{
          test: /\.js$/, // Transform all .js files required somewhere within an entry point...
          loader: 'babel-loader', // ...with the specified loaders...
          exclude: path.join(__dirname, '/node_modules/') // ...except for the node_modules folder.
        }, {
          test:   /\.css$/, // Transform all .css files required somewhere within an entry point...
          use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: { importLoaders: 1 },
            },
            'postcss-loader',
          ],
        }),
        }, {
          test: /\.(jpg|png|svg)$/,
          loader: "url-loader?limit=10000"
        }, {
          test: /\.(jpg|png|svg)$/,
          loader: "file-loader?[path][name].[ext]limit=10000"
        },
      ]
    },
    plugins: plugins,
    target: "web", // Make web variables accessible to webpack, e.g. window
    stats: true, // Don't show stats in the console
    //progress: true,
    //displayErrorDetails: true
  }
}
