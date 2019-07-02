const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const fs = require('fs');
const rootPath = process.cwd();

const configFile = path.join(rootPath, '.demosrc.js');
if(!fs.existsSync(configFile)) {
  throw new Error('No .demosrc.js file found in project.');
}

let config = require(configFile);

if(typeof config === 'function') {
  config = config(process.env.NODE_ENV);
}

let port = 10086;
if(config.devServer && config.devServer.port) {
  port = config.devServer.port;
}
let source = config.source || 'demos';
let output = config.output || {dir: 'dist'};
let demoList = config.demoList || '.demoList.json';

if(typeof output === 'string') {
  output = {dir: output};
}

let themeFilePath = path.resolve(__dirname, './src/css/default_theme.scss');

if(config.themeFile) {
  themeFilePath = path.resolve(rootPath, config.themeFile);
}


console.warn(`Source directory: ${source}.`);
console.warn(`Output directory: ${output.dir}.`);
console.warn(`PublicUrl: ${output.publicUrl || '/'}.`);

module.exports = {
  entry: path.join(__dirname, 'index.js'),
  output,
  publicFolder: path.join(rootPath, config.staticFolder || config.publicFolder || 'static'),
  devServer:{
    port,
  },
  envs: {
    NODE_ENV: process.env.NODE_ENV,
  },
  chainWebpack(config) {
    config.merge({
      plugin: {
        monaco: {
          plugin: MonacoWebpackPlugin,
        }
      },
      node: {
        fs: 'empty'
      },
      resolve: {
        alias: {
          '@': path.join(__dirname, 'src'),
          'demos': path.join(rootPath, source),
          '.demoList.json': path.join(rootPath, source, demoList),
          'manifest': path.join(rootPath, '.demosrc'),
          'themeFile': themeFilePath,
        }
      }
    })
    config
      .output
      .filename('[name].bundle.js')
  }
}