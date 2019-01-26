const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config.js')
const webpack = require('webpack')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  output: {
    filename: 'bound.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      // 处理css/scss/sass
      {
        test: /\.(sc|sa|c)ss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
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
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(), // 更方便查看patch的依赖
    new webpack.HotModuleReplacementPlugin() // HMR
  ],
  devServer: {
    clientLogLevel: 'warning', // 输出日志级别
    hot: true, // 启用热更新
    contentBase: path.resolve(__dirname, 'dist'), // 告诉服务器从哪里提供内容
    publicPath: '/', // 此路径下的打包文件可在浏览器下访问
    compress: true, // 启用gzip压缩
    host: '0.0.0.0',
    port: 9999,
    open: true, // 自动打开浏览器
    overlay: { // 出现错误或者警告时候是否覆盖页面线上错误信息
      warnings: true,
      errors: true
    },
    quiet: false,
    proxy: { // 设置代理
      '/dev': {
        target: 'http://dev.xxxx.com.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/dev': ''
        }
        /**
         * 如果你的配置是
         * pathRewrite: {
         *   '^/dev': '/order/api'
         *  }
         *  即本地请求 /dev/getOrder   =>  实际上是  http://dev.xxxx.com.cn/order/api/getOrder
        */
      },
      '/test': {
        target: 'http://test.xxxx.com.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/test': ''
        }
      },
      '/prod': {
        target: 'http://prod.xxxx.com.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/prod': ''
        }
      }
    },
    watchOptions: { // 监控文件相关配置
      poll: true,
      ignored: /node_modules/, // 忽略监控的文件夹, 正则
      aggregateTimeout: 300 // 默认值, 当你连续改动时候, webpack可以设置构建延迟时间(防抖)
    }
  }
})
