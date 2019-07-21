const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const fs = require('fs');
const rootPath = process.cwd();

const configFile = path.join(rootPath, '.demosrc.js');
if (!fs.existsSync(configFile)) {
  throw new Error('No .demosrc.js file found in project.');
}

let configCode = fs.readFileSync(configFile, 'utf-8');
const babel = require('@babel/core');
configCode = babel.transformSync(configCode, { presets: ['@babel/preset-env'] })
  .code;

const requireFromString = require('require-from-string');

let config = requireFromString(configCode);
config = config.default || config;

if (typeof config === 'function') {
  config = config(process.env.NODE_ENV);
}

let port = 3000;
if (config.devServer && config.devServer.port) {
  port = config.devServer.port;
}
let output = config.output || { dir: 'dist' };
let demoList = config.demoList || '.demoList.json';

if (typeof output === 'string') {
  output = { dir: output };
}

let themeFilePath = path.resolve(__dirname, './src/css/default_theme.scss');

if (config.themeFile) {
  themeFilePath = path.resolve(rootPath, config.themeFile);
}

console.warn(`Output directory: ${output.dir}.`);
console.warn(`PublicUrl: ${output.publicUrl || '/'}.`);

module.exports = {
  entry: path.join(__dirname, 'index.js'),
  output,
  publicFolder: path.join(
    rootPath,
    config.staticFolder || config.publicFolder || 'static'
  ),
  devServer: {
    port
  },
  cache: false,
  envs: {
    NODE_ENV: process.env.NODE_ENV
  },
  babel: {
    babelrc: !!config.babelrc,
    transpileModules: ['@demosify/core']
  },
  chainWebpack(config) {
    config.merge({
      plugin: {
        monaco: {
          plugin: MonacoWebpackPlugin
        }
      },
      node: {
        fs: 'empty'
      },
      resolve: {
        alias: {
          '@': path.join(__dirname, 'src'),
          '~': path.join(rootPath, 'demos'),
          demos: path.join(rootPath, 'demos'),
          '.demoList.json': path.join(rootPath, 'demos', demoList),
          manifest: path.join(rootPath, '.demosrc'),
          themeFile: themeFilePath
        }
      }
    });
    config.module
      .rule('json')
      .test(/\.json$/)
      .use('json')
      .loader('json-loader')
      .end();
    config.module.rule('json').store.set('type', 'javascript/auto');
    config.output.filename('[name].bundle.js');
  }
};
