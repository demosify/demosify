# DEMOSIFY

在项目中创建一个 Playground 来运行你的 Demos。

## 快速使用

1. 安装 @demosify/core

```bash
npm install @demosify/core --save-dev
```

2. 在你的项目根目录中创建 `.demosrc.js` 文件

```js
module.exports = {
  name: 'YOUR PROJECT NAME',
}
```

3. 在你的项目根目录中创建 `demos` 目录，在 `demos` 目录创建子目录中写你的demo：

```bash
mkdir demos
mkdir demos/demo1
```

4. 在 `demos/demo1` 目录中创建一个 `config.js` 配置：

```js
// config.js
const javascript = `console.log('this is a demo')`;

export default {
  javascript,
}
```

5. 在 `demos` 目录中创建 `.demoList.json` 文件：

```json
[
  "demo1"
]
```

6. 在 `package.json` 中添加 NPM Scripts:

```json
  "scripts": {
    "demo:dev": "demosify --serve",
    "demo:prod": "demosify --prod"
  }
```

7. 运行 `npm run demo:dev`，访问 `http://localhost:3000` 即可看到你的 demo。

## 加载外部文件

修改 `config.js`：

```js
export default async () => {
  const [javascript, html, css] = await Promise.all([
    import('!raw-loader!./index.js'),
    import('!raw-loader!./index.html'),
    import('!raw-loader!./style.css'),
  ]);

  return {
    javascript,
    html,
    css,
  }
}
```

在 `demos/demo1` 目录下新增 `index.js`、 `index.html` 和 `style.css` 文件：

```js
console.log('This is a demo.');
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>DEMO</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

```css
/* demo stylesheet */

body {
  background-color: red;
}
```

三个文件内容会被自动加载到 Playground 中。

## 发布

运行 

```bash
npm run demo:prod
```

代码默认被发布到项目下的 `dist` 目录中。
