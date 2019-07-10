export default async () => {
  const [htmlCode, jsCode, cssCode] = await Promise.all([
    import('!raw-loader!../assets/index.html'),
    import('!raw-loader!./script.js'),
    import('!raw-loader!../assets/style.css')
  ]);

  return {
    javascript: {
      code: jsCode,
      transformer: 'javascript',
      visible: true
    },
    html: {
      code: htmlCode,
      transformer: 'html',
      visible: true
    },
    css: {
      code: cssCode,
      transformer: 'css'
    },
    foldBoxes: ['html'],
    packages: {
      js: ['https://unpkg.com/spritejs/dist/spritejs.min.js'],
      css: []
    }
  };
};
