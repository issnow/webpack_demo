const { merge } = require('webpack-merge');
const baseWebpackConfig=require('./webpack.config.base')
const webpack = require('webpack')


module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: 'eval-cheap-module-source-map', //开发环境下使用
  //...其它的一些production环境配置
  plugins: [
    new webpack.DefinePlugin({
      DEV: JSON.stringify('prod'), //字符串
      FLAG: 'true' //FLAG 是个布尔类型
    })
  ]
})