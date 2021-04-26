module.exports = function(env) {
  return {
    devServer: {
      port: 3000,
    },
    output: {
      dir: 'docs',
      publicUrl: '.',
    },
    staticFolder: 'static',
    demoList: env === 'development' ? '.demoList.dev.json': '.demoList.prod.json',
    name: 'DEMOSIFY',
    version: 'v1',
    homePage: 'https://spritejs.org',
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
      js: ['https://unpkg.com/spritejs/dist/spritejs.min.js'],
      css: [],
    },
    // tab waterfall
    editorViewMode: 'tab',
    editorLayout: 'normal'
  };
};
