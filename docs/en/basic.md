# Installation

Install @demosify/core through NPM

```bash
npm install @demosify/core --save-dev
```

Or through Yarn：

```bash
yarn add @demosify/core --dev
```

# Getting Started

1. Create `.demosrc.js` file in your project root.

```js
module.exports = {
  name: 'YOUR PROJECT NAME',
}
```

2. Create `demos` directory in your project root. Add your demos in `demos` directory.

```bash
mkdir demos
mkdir demos/demo1
```

3. Create a `config.js` file in each of your demos, e.g. `demos/demo1`.

```js
// config.js
const javascript = `console.log('this is a demo')`;

export default {
  javascript,
}
```

4. Create a `.demoList.json` file in your `demos` directory. Specify all your demos show in sidebar. 

```json
[
  "demo1",
  ...
]
```

5. Add NPM scripts in your `package.json`:

```json
  "scripts": {
    "demo:dev": "demosify --serve",
    "demo:prod": "demosify --prod"
  }
```

6. Run `npm run demo:dev`, visit `http://localhost:3000`. You will see the playground. ✌🏻

## Configurations

There are three types of configurations in Demosify. Let's take a look at them one by one.

### .demosrc

Create `demorc.js` in the project root directory and demosify will automatically load the configuration from this file. The configurable options are as follows:

```js
module.exports = {
    devServer: {
      port: 3000, //default dev-server port: 3000
    },
    output: {
      dir: 'dist', // output dir, default is dist
      publicUrl: '/', // root url of your playground
    },
    demosPath: 'demos', // the demos folder, default is ./demos
    themeFile: 'demos/theme.scss', // a custom theme file, support sass
    staticFolder: 'static', // the static resource file path
    demoList: '.demoList.json', // the demoList config file, default is .demoList.json
    name: 'DEMOSIFY', // Playground's title
    version: 'v2',  // Playground's version number
    homePage: 'https://spritejs.org', // The homepage of the project
    logo: '', // The logo image
    boxTheme: 'monokai',  // The theme of the code editor
    // All themes: active4d, allHallowsEve, amy, blackboard, brillianceBlack,
    // brillianceDull, chromeDevtools, cloudsMidnight, clouds, cobalt,
    // dawn, dreamweaver, eiffel, espressoLibre, github, idle, katzenmilch,
    // kuroirTheme, lazy, magicwbAmiga, merbivoreSoft, merbivore, monokai,
    // pastelsOnDark, slushAndPoppies, solarizedDark, solarizedLight,
    // spacecadet, sunburst, textmateMacClassic, tomorrowNightBlue,
    // tomorrowNightBright, tomorrowNightEighties, tomorrowNight, tomorrow,
    // twilight, vibrantInk, zenburnesque, iplastic, idlefingers, krtheme,
    // monoindustrial,
    globalPackages: { // The libraries need to load.
      js: [ 
        '//lib.baomitu.com/babel-polyfill/7.0.0-beta.44/polyfill.min.js', 
        spritejs
      ],
      css: [],
    },
    // tab waterfall
    editorViewMode: 'tab',  // The UI presentation of the code block, tab or waterfall
    editorLayout: 'normal',  // allocation relationship between canvas and code sandbox, normal or reverse
};
```

### .demoList

You must create a `demoList` file in your `demos` directory. The default file name is `.demoList.json`. You can modify the file name by edit the `.demosrc.js` file.

The file returns a configure array, specify all the demos in playground's sidebar.

```json
[
  "demo1",
  "demo2",
  "demo3",
  ...
]
```

You can alse specify a label, it will be shown in sidebar.

```json
[
  { "label": "demoName1", "src": "demo1" },
  { "label": "demoName2", "src": "demo2" },
  { "label": "demoName3", "src": "demo3" },
  ...
]
```

Demosify supports multilevel catalogue,

use src can set multilevel catalogue directly,

if you wanna make alias for directly, you can use 'demo' property to set child demos,

Now, you only can create second-level catelogue most.

```json
[
  { "label": "demoName1", "src": "demo1" },
  { "label": "demoName2", "src": "demo2" },
  { "label": "demoName3", "src": "subdir/demo3" },
  { "label": "demoName4", "src": "subdir/demo4" },
  { 
    "group": "groupName",
    "src": "group",
    "demos": [
      {
        "label": "childName1",
        "src": "child1"
      },
      {
        "label": "childName2",
        "src": "child2"
      }
    ]
  },
  ...  
]
```

### config.js

Under each demo directory, a `config.js` file specifies the `demo` configuration.

A usual `config.js` configuration file is as follows:

```js
export default async () => {
  const [htmlCode, jsCode, cssCode] = await Promise.all([
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

## Deploy

Run `npm run demo:prod`.

All the demos will be deploy to production into `dist` directory of your project.
