const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const Dotenv = require('dotenv-webpack');

const criticalCSS = new ExtractTextPlugin("stylesheets/global.css");

const DIST = "DIST";

module.exports = {
  entry: {
    index: "./src/index.js",
    map: "./src/map.js"
  },
  devServer: {
    host: "0.0.0.0",
    allowedHosts: ["192.168.1.65.", "laboratory12.local"]
  },
  devtool: "inline-source-map",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "DIST")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, "./src/components/")],
        use: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader"
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, "./src/global/")],
        use: criticalCSS.extract({
          fallback: "style-loader",
          use: ["css-loader", "postcss-loader"]
        })
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "file-loader",
            options: {}
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["env"]
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  plugins: [
    new CleanPlugin([DIST]),
    criticalCSS,
    new HtmlWebpackPlugin({
      title: "Geo Bird Location",
      template: path.resolve(__dirname, "./templates/index.html"),
      chunks: ["index"],
      inlineSource: ".(css)$",
      filename: "index.html",
      minify: { minifyJS: true, collapseWhitespace: true }
    }),
    new HtmlWebpackPlugin({
      title: "Map Bird Location",
      template: path.resolve(__dirname, "./templates/map.html"),
      chunks: ["map"],
      inlineSource: ".(css)$",
      filename: "./map.html",
      minify: { minifyJS: true, collapseWhitespace: true }
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new UglifyJSPlugin(),
    new Dotenv({
      path: './.env',
    })
  ]
};
