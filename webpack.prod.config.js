const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssertsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config.js')
const devMode = process.env.NODE_ENV !== 'production'

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    filename: 'bound.[hash:5].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      // 处理css/scss/sass
      {
        test: /\.(sc|sa|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('autoprefixer')({
                  browsers: [
                    'last 10 Chrome versions',
                    'last 5 Firefox versions',
                    'Safari >= 6',
                    'ie > 8'
                  ]
                })
              ]
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    // 提取CSS
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash:5].css', // 设置输出的文件名
      chunkFilename: devMode ? '[id].css': '[id].[hash:5].css'
    })
  ],
  optimization: {
    minimizer: [
      // 压缩JS
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
        // 等等详细配置见官网
      }),
      // 压缩CSS
      new OptimizeCSSAssertsPlugin({})
    ]
  }
})
