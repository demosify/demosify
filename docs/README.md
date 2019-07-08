# DEMOSIFY

## Usage

```bash
npm install @demosify/core --save-dev
```

Add `.demorc.js`:

```js
module.exports = {
  devServer: {
    port: 3000,
  },
  output: 'docs', // default is dist
  name: 'Your project name',
  version: 'Your project version',
  homePage: 'You project homepage url',
  logo: '',
  // 可选主题: active4d, allHallowsEve, amy, blackboard, brillianceBlack,
  // brillianceDull, chromeDevtools, cloudsMidnight, clouds, cobalt,
  // dawn, dreamweaver, eiffel, espressoLibre, github, idle, katzenmilch,
  // kuroirTheme, lazy, magicwbAmiga, merbivoreSoft, merbivore, monokai,
  // pastelsOnDark, slushAndPoppies, solarizedDark, solarizedLight,
  // spacecadet, sunburst, textmateMacClassic, tomorrowNightBlue,
  // tomorrowNightBright, tomorrowNightEighties, tomorrowNight, tomorrow,
  // twilight, vibrantInk, zenburnesque, iplastic, idlefingers, krtheme,
  // monoindustrial,
  boxTheme: 'monokai',
  globalPackages: {
    js: [/* js lib */],
    css: [/* css lib */],
  },
  // tab waterfall
  editorViewMode: 'tab',
}
```

Create source directory and add `.demoList.json`:

```json
["quick start"]
```

Create your demo directory and files.

Edit your package.json

```json
scripts: {
  "start": "demosify --serve",
  "build:demo": "demosify"
}
```

Done.
