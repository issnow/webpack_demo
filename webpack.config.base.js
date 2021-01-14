let HtmlWebpackPlugin = require('html-webpack-plugin')
let path = require('path')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// webpack也需要require,不然使用不了
let webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// 个性化配置html
const isDev = process.env.NODE_ENV === 'development'
const config = require('./public/config')[isDev ? 'dev' : 'build']

module.exports = {
  // devtool: 'eval-cheap-module-source-map', //开发环境下使用
  devServer: {
    // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要。devServer.publicPath 将用于确定应该从哪里提供 bundle，并且此选项优先。
    contentBase: path.resolve(__dirname, 'dist'),
    //指定要监听请求的端口号：
    port: '5000', //默认是8080
    // 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
    quiet: false, //默认不启用
    inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
    //To show only errors in your bundle
    stats: "errors-only", //终端仅打印 error
    // 启用 overlay 后，当编译出错时，会在浏览器窗口全屏输出错误，默认是关闭的
    overlay: false, //默认不启用
    //当使用内联模式(inline mode)时，在开发工具(DevTools)的控制台(console)将显示消息，如：在重新加载之前，在一个错误之前，或者模块热替换(Hot Module Replacement)启用时
    clientLogLevel: "silent", //日志等级
    compress: true, //是否启用 gzip 压缩
    //Tells dev-server to open the browser after server had been started. Set it to true to open your default browser.
    open: true,
    // Enable webpack's Hot Module Replacement feature:(热更新)
    hot: true,
    //配置代理,请求到 /api/users 现在会被代理到请求 http://localhost:3000/api/users
    // proxy: {
    //   '/api': 'http://localhost:3000'
    // },
    // 如果你不想始终传递 /api ，则需要重写路径：
    // !虽然设置了代理,但是在浏览器的network中仍然显示未代理的路径: http://localhost:4000/get/data
    proxy: {
      // 如果后端接口也是api开头,则请求/api/user-->http://localhost:3000/api/user
      "/api": {
        target: "http://localhost:3000",
        // pathRewrite: {"^/api" : ""}
      },
      // 如果后端接口不是api开头,则请求/get/data-->http://localhost:3000/data
      '/get': {
        target: 'http://localhost:3000',
        pathRewrite: {
          '^/get': ''
        }
      }
    }
  },
  // 单页
  // entry: './src/index.js', //默认值为 ./src
  // 多页
  entry: {
    index: './src/index.js',
    login: './src/login.js'
  },
  output: { //默认值为 ./dist
    path: path.resolve(__dirname, 'dist'), //目标输出目录 path 的绝对路径。
    filename: '[name].[hash:6].js',//filename 用于输出文件的文件名
    // filename: '[name][chunkhash:8].js',// js文件指纹设置
    // publicPath: '/' //通常是CDN地址
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, //匹配规则
        // 直接这样写需要在外层写一个.babelrc文件,可以直接在这里配置babel
        // use: ['babel-loader'],
        use: [
          'thread-loader',
          'cache-loader',
          {
            loader: 'babel-loader',
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                ["@babel/plugin-transform-runtime", {
                  "corejs": 3
                }]
              ]
            }
          }
        ],
        // exclude: /node_modules/, //排除 node_modules 目录
        include: [path.resolve(__dirname, 'src')]
      }, {
        test: /\.(le|c)ss/,
        use: [
          // 
          // 'style-loader', 
          // 抽离在js中import的CSS,下面的loader是替换了style-loader
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // only enable hot in development
              hmr: isDev,
              // if hmr does not work, this is a forceful method.
              // 修改css热更新
              reloadAll: true,
            }
          },
          'css-loader', {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [
                  // require('autoprefixer')({
                  //   "overrideBrowserslist": [
                  //     ">0.25%",//全球超过0.25%人使用的浏览器
                  //     "not dead"//流行的浏览器
                  //   ]
                  // })
                  require('autoprefixer')
                ]
              }
            }
          }, 'less-loader'
        ],
        exclude: /node_modules/
      }, {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240, //10kb
            esModule: false,
            name: '[name]_[hash:6].[ext]', //name表示原文件名,图片设置文件指纹
            outputPath: 'assets' //超过limit大小的图片打包到dist下面的目录
          }
        }],
        exclude: /node_modules/
      },
      //处理html中的img
      // {
      //   test: /\.html$/,
      //   use: ['html-withimg-loader']
      // }
    ],
    // 如果一些第三方模块没有AMD/CommonJS规范版本，可以使用 noParse 来标识这个模块，这样 Webpack 会引入这些模块，但是不进行转化和解析，从而提升 Webpack 的构建性能 ，例如：jquery 、lodash。
    noParse(content) {
      return /jquery|lodash/.test(content)
    }
  },
  plugins: [
    //数组 放着所有的webpack插件
    new HtmlWebpackPlugin({
      title: 'My App',
      filename: 'index.html', //打包后的文件名
      template: './public/index.html', //源文件
      // config: config.template, //用来个性化配置
      // minify: {
      //   removeAttributeQuotes: false, //是否删除属性的双引号
      //   collapseWhitespace: false, //是否折叠空白
      // },
      hash: true, //是否加上hash，默认是 false
      // 多页应用时指定加载js文件
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      template: './public/login.html',
      filename: 'login.html', //打包后的文件名
      // 多页应用时指定加载js文件
      chunks: ['login']
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**']
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: './public/js/*.js',
        to: path.resolve(__dirname, 'dist', 'js'),
        // ?建议设置为true,不设置true还是会报错,flatten 这个参数，设置为 true，那么它只会拷贝文件，而不会把文件夹路径都拷贝上
        flatten: true,
        // 但是想过滤掉某个或某些文件，那么 CopyWebpackPlugin 还为我们提供了 ignore 参数。npm run build 构建，可以看到 dist/js 下不会出现 other.js 文件
        globOptions: {
          ignore: ['**/other.js']
        }
      }],
    }),
    // 不需要每次都import了,比如vue,react,配置之后，你就可以在项目中随心所欲的使用vue,react,$,起飞
    new webpack.ProvidePlugin({
      // React: 'react',
      // Component: ['react', 'Component'],
      // Vue: ['vue/dist/vue.esm.js', 'default'],
      $: 'jquery',
      // _map: ['lodash', 'map']
    }),
    // 抽离CSS
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:6].css', //注意这里不要写css/[name].css,会有问题
      chunkFilename: '[id].[contenthash:6].css',
    }),
    // 将抽离出来的css文件进行压缩
    new OptimizeCssAssetsPlugin(),
    //热更新插件,和devserver中的hot:true搭配使用
    // 另外，大家测试的时候注意一下，speed-measure-webpack-plugin 和 HotModuleReplacementPlugin 不能同时使用，否则会报错:
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dist', 'dll', 'manifest.json')
    }),
  ],
  // mode: 'development', //会将 process.env.NODE_ENV 的值设为 development / production
  resolve: {
    // 创建 import 或 require 的别名，来确保模块引入变得更简单。例如，一些位于 src/ 文件夹下的常用模块：
    alias: {
      'Com': path.resolve(__dirname, 'src/components')
    },
    // 如果你想要添加一个目录到模块搜索目录，此目录优先于 node_modules/ 搜索
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  }
}