const { merge } = require('webpack-merge');
const baseWebpackConfig=require('./webpack.config.base')
const webpack = require('webpack');
// speed-measure-webpack-plugin 插件可以测量各个插件和loader所花费的时间，使用之后，构建时,在控制台会显示模块构建所需要的时间
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// speed-measure-plugin用法:直接在导出的webpack配置包裹smp.wrap
module.exports = smp.wrap(merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map', //开发环境下使用
  //...其它的一些dev环境配置
  plugins: [
    // 可以配置的全局常量,在使用的时候直接用不需要process.env语法,
    new webpack.DefinePlugin({
      BOOLEAN: true,//布尔类型正常定义和使用
      NUM: 123,//number类型正常定义和使用
      STRING: JSON.stringify('hello'),//string类型定义需要JSON.stringify(),正常使用
      ARR: [1,2,3],//布尔类型正常定义,但使用的时候会转成对象{0: 1, 1: 2, 2: 3}
      OBJ: {//对象类型正常定义和使用,但是里面的字符串还是需要JSON.stringify()转化
        name: JSON.stringify('guocheng')
      }
    }),
    // 可视化查看bundle的体积
    new BundleAnalyzerPlugin()
  ]
}))