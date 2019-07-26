import * as Babel from '@babel/standalone';

export default async () => {
  const [htmlCode, jsCode, cssCode] = await Promise.all([
    import('!raw-loader!./index.html'),
    import('!raw-loader!./script.js'),
    import('!raw-loader!./style.css')
  ]);

  return {
    javascript: {
      code: jsCode,
      transformer: 'typescript',
      transform(code) {
        const _code = Babel.transform(code, {
          presets: ['es2015'],
          plugins: ['transform-typescript']
        }).code;
        return _code;
      },
      editorHook(monaco, value, language) {
        const typescriptService =
          monaco.languages.typescript.typescriptDefaults;
        typescriptService.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: false
        });
        typescriptService.setCompilerOptions({
          experimentalDecorators: true,
          noLib: true
        });
        const model = monaco.editor.createModel(
          value,
          language,
          monaco.Uri.parse('file:///main.ts')
        );
        return model;
      },
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
      js: [],
      css: []
    }
  };
};
