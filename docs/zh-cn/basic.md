# 安装

可以通过 NPM 安装：

```bash
npm install @demosify/core --save-dev
```

或通过 Yarn 安装：

```bash
yarn add @demosify/core --dev
```

# 起步

1. 在你的项目根目录中创建 `.demosrc.js` 文件

```js
module.exports = {
  name: 'YOUR PROJECT NAME',
}
```

2. 在你的项目根目录中创建 `demos` 目录，在 `demos` 目录创建子目录中写你的demo：

```bash
mkdir demos
mkdir demos/demo1
```

3. 在 `demos/demo1` 目录中创建一个 `config.js` 配置：

```js
// config.js
const javascript = `console.log('this is a demo')`;

export default {
  javascript,
}
```

4. 在 `demos` 目录中创建 `.demoList.json` 文件：

```json
[
  "demo1"
]
```

5. 在 `package.json` 中添加 NPM Scripts:

```json
  "scripts": {
    "demo:dev": "demosify --serve",
    "demo:prod": "demosify --prod"
  }
```

6. 运行 `npm run demo:dev`，访问 `http://localhost:3000` 即可看到你的 demo。

## 配置

Demosify 中有3类配置，分别是 `.demosrc`、`.dmoeList.json` 和项目中的 `config.js`，我们一一来看一下。

### .demosrc

在项目根目录创建 `.demorc.js`，demosify 会自动读取这个文件的配置，可配置项如下：

```js
module.exports = {
    devServer: {
      port: 3000, //配置开发服务器的端口号，默认值3000
    },
    output: {
      dir: 'dist', // 配置构建部署时输出的目录，默认dist目录
      publicUrl: '/', // 配置构建输出的资源根目录，默认是'/'
    },
    themeFile: 'demos/theme.scss', // 如果有自定义主题的话，配置自定义主题的文件名，支持SASS
    staticFolder: 'static', // 配置静态资源文件路径，默认为 static
    demoList: '.demoList.json', // demoList配置文件的文件名，默认为.demoList.json
    name: 'DEMOSIFY', // 配置Playground的标题 
    version: 'v2',  // 配置Playground的版本号信息
    homePage: 'https://spritejs.org', // 配置Playground链接跳转的主页
    logo: '', // 配置Playground的LOGO，如果配置了LOGO，标题就不显示
    boxTheme: 'monokai',  // 配置代码编辑器的主题
    // 可选主题: active4d, allHallowsEve, amy, blackboard, brillianceBlack,
    // brillianceDull, chromeDevtools, cloudsMidnight, clouds, cobalt,
    // dawn, dreamweaver, eiffel, espressoLibre, github, idle, katzenmilch,
    // kuroirTheme, lazy, magicwbAmiga, merbivoreSoft, merbivore, monokai,
    // pastelsOnDark, slushAndPoppies, solarizedDark, solarizedLight,
    // spacecadet, sunburst, textmateMacClassic, tomorrowNightBlue,
    // tomorrowNightBright, tomorrowNightEighties, tomorrowNight, tomorrow,
    // twilight, vibrantInk, zenburnesque, iplastic, idlefingers, krtheme,
    // monoindustrial,
    globalPackages: { // 配置需要加载的 JS、CSS 库
      js: [ 
        '//lib.baomitu.com/babel-polyfill/7.0.0-beta.44/polyfill.min.js', 
        spritejs
      ],
      css: [],
    },
    // tab waterfall
    editorViewMode: 'tab',  // 配置代码块的UI展示方式，现在支持tab和waterfall两种展示方式
  };
};
```

### .demoList

在 `demos` 目录下，需要创建一个 `demoList` 文件，默认文件名是 `.demoList.json`，这是一个 JSON 文件，通过修改 `.demosrc.js` 的配置也可以指定成 JS 文件。

这个文件要返回一个数组，数组中的内容是 Playground 侧边栏列出的所有展示的 demos。

```json
[
  "demo1",
  "demo2",
  "demo3",
  ...
]
```

默认的标题是demo目录名，但你也可以指定标题：

```json
[
  { "label": "演示1", "src": "demo1" },
  { "label": "演示2", "src": "demo2" },
  { "label": "演示3", "src": "demo3" },
  ...
]
```

Demosify 是支持多级目录的，所以 src 可以指定子目录：

```json
[
  { "label": "演示1", "src": "demo1" },
  { "label": "演示2", "src": "demo2" },
  { "label": "演示3", "src": "subdir/demo3" },
  ...  
]
```

### config.js

在每个demo的目录下，要有一个`config.js`文件指定`demo`的配置。

一个比较完整的 `config.js` 配置项如下：

```js
export default async () => {
  const [htmlCode, jsCode, cssCode] = await Promise.all([
    import('!raw-loader!./index.html'),
    import('!raw-loader!./index.js'),
    import('!raw-loader!./style.css'),
  ]);

  return {
    javascript: {
      code: jsCode, // JavaScript 代码
      transformer: 'javascript',  // JavaScript transformer
      visible: true,  // 是否显示编辑器
    },
    html: {
      code: htmlCode, // HTML 代码
      transformer: 'html',
      visible: true,
    },
    css: {
      code: cssCode,  // CSS 代码
      transformer: 'css',
    },
    foldBoxes: ['html'],  // 在 waterfall 模式下收起的 box
    packages: {
      js: [
        'https://s0.ssl.qhres.com/static/e48aa70cee113a64.js',  // 加载外部 js 文件
      ],
      css: [],  // 加载外部 CSS 文件
    }
  }
}
```

config.js 可以 export 一个异步的函数，通过动态 import 加载目录下的 js、css、html 文件。

## 部署

运行 

```bash
npm run demo:prod
```

代码默认被发布到项目下的 `dist` 目录中，你可以在 `.demosrc.js` 中指定其他目录。
