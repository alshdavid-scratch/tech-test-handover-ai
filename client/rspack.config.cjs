const path = require('path')
const fs = require('fs')
const { HtmlRspackPlugin, CopyRspackPlugin, CssExtractRspackPlugin } = require('@rspack/core')

if (fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.rmSync(path.join(__dirname, 'dist'), { recursive: true })
}

/** @type {import('@rspack/core').Configuration} */
const config = {
  devtool: false,
  experiments: {
  },
  entry:  path.join(__dirname, 'src', 'cmd', 'main.tsx'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            externalHelpers: false,
            parser: {
              syntax: 'typescript',
              decorators: true,
            },
            preserveAllComments: false,
            transform: {
              react: {
                pragma: 'h',
                pragmaFrag: 'Fragment',
                throwIfNamespace: true,
                useBuiltins: false,
              },
            }
          },
        },
        type: 'javascript/auto',
      },
      {
        test: /\.(sass|scss)$/,
        use: [CssExtractRspackPlugin.loader, 'css-loader', 'sass-loader'],
        type: 'javascript/auto',
      },
      {
        test: /\.(txt)$/,
        type: "asset/resource",
      },
    ]
  },
  plugins: [
    new CssExtractRspackPlugin({}),
    new HtmlRspackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'src', 'cmd', 'index.html'),
    }),
    new CopyRspackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }
      ]
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'jsx', 'css', 'scss'],
  },
  devServer: {
    hot: false,
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api/flickr'],
        pathRewrite: { '^/api/flickr': '' },
        changeOrigin: true,
        target: 'https://www.flickr.com',
      },
    ],
  },
}

module.exports = config