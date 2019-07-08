# Boxes

在 Demosify 中有三个 boxes，默认展示 HTML、CSS 和 JavaScript。

我们在 demo 的 `config.js` 中可以配置它们：

```js
export default async () => {
  const [jsCode, htmlCode, cssCode] = await Promise.all([
    import(/* webpackChunkName: "demo-demo1" */ '!raw-loader!./index.html'),
    import(/* webpackChunkName: "demo-demo1" */ '!raw-loader!./index.js'),
    import(/* webpackChunkName: "demo-demo1" */ '!raw-loader!./style.css'),
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

## transform

如果我们要对HTML、JS或者CSS进行预处理，我们可以添加 transform，比如我们可以使用 [@babel/standalone](https://babeljs.io/docs/en/next/babel-standalone.html) 来处理我们的 JS 代码：

```js
import * as Babel from '@babel/standalone';

  ...
  javascript: {
    code: jsCode,
    transformer: 'typescript',
    transform(code) {
      const _code = Babel.transform(code, { 
        presets: ['es2015'],
        plugins: ['transform-typescript'],
      }).code;
      return _code;
    },
    visible: true,
  },
```

我们给 `config.js` 的 javascript 配置增加一个 `transform(code)` 方法，这个方法会在创建 sandbox 之前处理代码，我们使用 `Babel.transform(code, {...})` 来处理 typescript，这样我们就可以创建支持 TypeScript 的 Playground 了。

注意，我们把 transformer 配置为 `typescript`，这样告诉编辑器采用 typescript 的语法高亮规则来显示代码。

## editorHook

Demosify 提供一个 hook，在编辑器渲染代码前，可以调用编辑器 monacoEditor 的实例修改配置项。因此如果我们要使用一个不被默认支持的语言语法时，我们可以在 config.js 中提供一个 editorHook 来处理，比如：

```js
import glsl from '../glsl-lang.js';

  ...
    javascript: {
      code: jsCode,
      transformer: 'glsl',
      transform(code) {
        return `const doodle = new Doodle(glslDoodle);
doodle.compile(\`${code}\`).then((program) => {
  doodle.useProgram(program);
  doodle.render();
});`;
      },
      editorHook(monaco, code, language) {
        // Register a new language
        monaco.languages.register({ id: 'glsl' });

        // Register a tokens provider for the language
        monaco.languages.setMonarchTokensProvider('glsl', glsl);
      },
      visible: true,
    },
```

这样我们就可以支持 glsl （WebGL shader）语言的 demo 了。