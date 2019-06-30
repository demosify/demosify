const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const fs = require('fs');
const rootPath = process.cwd();

const configFile = path.join(rootPath, '.demosrc.js');
if(!fs.existsSync(configFile)) {
  throw new Error('No .demosrc.js file found in project.');
}

const config = require(configFile);
let port = 10086;
if(config.devServer && config.devServer.port) {
  port = config.devServer.port;
}
let source = config.source || 'demos';
let output = config.output || 'dist';

console.warn(`Source directory: ${source}.`)
console.warn(`Output directory: ${output}.`)

module.exports = {
  entry: path.join(__dirname, 'index.js'),
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
          '@': path.join(__dirname, 'src'),
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