const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const rootPath = process.cwd();

const config = require(path.join(rootPath, '.demosrc'));
let port = 10086;
if(config.devServer && config.devServer.port) {
  port = config.devServer.port;
}
let source = config.source || 'demos';
let output = config.output || 'dist';

module.exports = {
  output: {
    dir: output,
  },
  devServer:{
    port,
  },
  chainWebpack(config) {
    config.merge({
      plugin: {
        monaco: {
          plugin: MonacoWebpackPlugin,
        }
      },
      resolve: {
        alias: {
          'demos': path.join(rootPath, source),
          '.demoList.json': path.join(rootPath, source, '.demoList.json'),
          'manifest': path.join(rootPath, '.demosrc'),
        }
      }
    })
    config
      .output
      .filename('[name].bundle.js')
  }
}