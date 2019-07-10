export default function(env) {
  return {
    devServer: {
      port: 3000,
    },
    output: {
      dir: 'docs/demo',
      publicUrl: env === 'development' ? '/' : '.',
    },
    themeFile: 'demos/theme.scss',
    staticFolder: 'static',
    demoList: env === 'development' ? '.demoList.dev.json': '.demoList.prod.json',
    name: 'SPRITEJS',
    version: 'v2',
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
      js: [],
      css: [],
    },
    // tab waterfall
    editorViewMode: 'tab',
  };
}
