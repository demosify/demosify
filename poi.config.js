const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
module.exports = {
  devServer:{
    port: 10086
  },
  chainWebpack(config) {
    config.merge({
      plugin: {
        monaco: {
          plugin: MonacoWebpackPlugin,
        }
      }
    })
    config
      .output
      .filename('[name].bundle.js')
  }
}