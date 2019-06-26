export default async () => {
  const [htmlCode, jsCode, cssCode] = await Promise.all([
    import(/* webpackChunkName: "demo-demo1" */ '!raw-loader!./index.html'),
    import(/* webpackChunkName: "demo-demo1" */ '!raw-loader!./script.js'),
    import(/* webpackChunkName: "demo-demo1" */ '!raw-loader!./style.css'),
  ]);

  return {
    javascript: {
      code: jsCode,
      transformer: 'javascript',
    },
    html: {
      code: htmlCode,
      transformer: 'html',
    },
    css: {
      code: cssCode,
      transformer: 'css'
    },
    foldBoxes: [],
    visibleBoxes: ['javascript', 'css'],
    packages: {
      js: [],
      css: ['https://lib.baomitu.com/animate.css/3.7.2/animate.min.css'],
    }
  }
}