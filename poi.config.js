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
let output = config.output || {dir: 'dist'};

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
  publicFolder: path.join(rootPath, config.publicFolder || 'public'),
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
          'themeFile': themeFilePath,
        }
      }
    })
    config
      .output
      .filename('[name].bundle.js')
  }
}