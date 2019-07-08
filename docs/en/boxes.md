# Boxes

There are three boxes in Demosify, which show HTML, CSS and JavaScript by default.

We can configure them in demo's `config.js`:

```js
export default async () => {
  const [jsCode, htmlCode, cssCode] = await Promise.all([
    import('!raw-loader!./index.html'),
    import('!raw-loader!./index.js'),
    import('!raw-loader!./style.css'),
  ]);

  return {
    javascript: {
      code: jsCode, // JavaScript code
      transformer: 'javascript',  // JavaScript transformer
      visible: true,  // show editor box or not
    },
    html: {
      code: htmlCode, // HTML code
      transformer: 'html',
      visible: true,
    },
    css: {
      code: cssCode,  // CSS code
      transformer: 'css',
    },
    foldBoxes: ['html'],  // fold the boxes under waterfall style
    packages: {
      js: [
        'https://s0.ssl.qhres.com/static/e48aa70cee113a64.js',  // js libraries
      ],
      css: [],  //  css libraries
    }
  }
}
```

## transform

If we want to pre-process HTML, JS or CSS, we can add transforms, such as [@babel/standalone] (https://babeljs.io/docs/en/next/babel-standalone.html) to process our JS code:

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

We add a `transform (code)` method to the `config.js`, which processes the code before creating sandbox. We use `Babel.transform(code, {...})` to process typescript, so that we can create a PlayGround that supports TypeScript.

Note that we configure transformer as `typescript`, which tells the editor to display the code using the syntax highlighting rule of typescript.

## editorHook

Demosify provides a hook that can pass the instance of the editor Monaco Editor for user to modify the options before the editor show the code. So if we want to use a language that is not supported by default, we can provide an editor Hook in `config.js` to handle it, for example:

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

Thus we can display the demo of the glsl (WebGL shader) code.