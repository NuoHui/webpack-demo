const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackplugin = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: './src/index.js',
  resolve: {
    // 模块扩展名, 引入文件今可能写文件名
    extensions: ['.js', '.vue', '.json'],
    // 配置别名来映射路径
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      // 对于固定的库, 减少递归解析
      'vue': path.resolve(__dirname, 'node_modules/vue/dist/vue.min.js')
    },
    // 指明第三方模块的绝对路径, 减少路径查找
    modules: [path.resolve(__dirname, 'node_modules')]
  },
  // 配置外部依赖不会打包到boudle
  externals: {
    jquery: 'jQuery'
  },
  module: {
    // 忽略对没采用模块化的模块进行递归解析
    noParse: [/vue\.min\.js/],
    rules: [
      // 编译js
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        include: path.resolve(__dirname, 'src'), // 缩小命中范围, 减少构建时间
        use: [
          {
            loader: 'babel-loader?cacheDirectory' // 通过cacheDirectory选项开启支持缓存
          },
          {
            loader: 'eslint-loader',
            options: {
              fix: true
            }
          }
        ]
      },
      // 处理字体
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          // 文件大小小于limit参数，url-loader将会把文件转为DataUR
          limit: 10000,
          name: '[name]-[hash:5].[ext]',
          output: 'fonts/'
          // publicPath: '', 多用于CDN
        }
      },
      // 处理文件
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          // 转base64
          {
            loader: 'url-loader',
            options: {
              // 具体配置见插件官网
              limit: 10000,
              name: '[name]-[hash:5].[ext]',
              outputPath: 'img/'// outputPath所设置的路径，是相对于 webpack 的输出目录。
              // publicPath 选项则被许多webpack的插件用于在生产模式下更新内嵌到css、html文件内的 url , 如CDN地址
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          }
        ]
      },
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              loaders: {
                sass: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader']
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackplugin(['dist']),
    // 打包模板
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      cache: true,
      chunksSortMode: 'none',
      title: 'Webapck4-demo', // 可以由外面传入
      filename: 'index.html', // 默认index.html
      template: path.resolve(__dirname, 'index.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      }
    }),
    new VueLoaderPlugin()
  ]
}
