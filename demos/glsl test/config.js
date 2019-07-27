import glsl from '../glsl-lang.js';

export default async () => {
  const [htmlCode, jsCode, cssCode] = await Promise.all([
    import('!raw-loader!../assets/glsl-index.html'),
    import('!raw-loader!./script.glsl'),
    import('!raw-loader!../assets/glsl-style.css'),
  ]);

  return {
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
    html: {
      code: htmlCode,
      transformer: 'html',
      visible: true,
    },
    css: {
      code: cssCode,
      transformer: 'css',
    },
    foldBoxes: ['html'],
    packages: {
      js: [
        'https://s0.ssl.qhres.com/static/e48aa70cee113a64.js',
      ],
      css: [],
    }
  }
}