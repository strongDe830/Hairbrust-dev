const path = require('path');
const glob = require('glob');
const pluralize = require('pluralize');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const getNamedFilesFromPath = (filePath, customPrefix = null) => {
  return glob.sync(path.join(__dirname, filePath)).reduce((acc, current) => {
    const splitPath = current.split('/');
    const prefix = customPrefix ? customPrefix : pluralize.singular(splitPath[(splitPath.length - 2)]);
    const fileName = splitPath.pop().replace(/\.[^/.]+$/, '');
    const name = `${prefix}-${fileName}`;
    acc[name] = current;
    return acc;
  }, {})
}

module.exports = {
  entry: {
    theme: [
      './_build/scripts/theme.js',
      './_build/styles/theme.scss'
    ],
    ...getNamedFilesFromPath('/_build/scripts/spark/**.js'),
    ...getNamedFilesFromPath('/_build/scripts/sections/**.js'),
    ...getNamedFilesFromPath('/_build/scripts/snippets/**.js'),
    ...getNamedFilesFromPath('/_build/styles/sections/**.scss'),
    ...getNamedFilesFromPath('/_build/styles/snippets/**.scss'),
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
      },
      {
        test: /\.(scss)$/,
        use: [MiniCssExtractPlugin.loader,'css-loader', 'sass-loader']
      }
    ]
  },
  resolve: {
      extensions: ['*', '.js']
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  output: {
      path: path.resolve(__dirname, './assets'),
      filename: '[name].js',
  },
};
