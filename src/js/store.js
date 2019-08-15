import Vue from 'vue/dist/vue.esm';
import Vuex from 'vuex';
import userConfig from 'manifest';
import demoList from '.demoList.json';
import router from '@/js/router.js';
import bus from '@/js/eventbus.js';

let config = userConfig;
if (typeof config === 'function') {
  config = config(process.env.NODE_ENV);
}

config = Object.assign(
  {
    name: 'DEMOSIFY',
    version: 'v1',
    homePage: 'https://github.com/betseyliu/demo-ground',
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
      css: []
    },
    // tab waterfall
    editorViewMode: 'tab'
  },
  config
);

import progress from 'nprogress';
progress.configure({
  showSpinner: false
});

Vue.use(Vuex);

const demoBoxes = {};

function importAllDemo(r) {
  r.keys().forEach(key => {
    const matched = /^\.\/((?:.+\/)*.+)\//.exec(key);
    if (matched) {
      demoBoxes[matched[1]] = r(key).default;
    }
  });
}
importAllDemo(require.context('demos', true, /config.js$/));

const links = demoList.map(link => {
  if (typeof link === 'string') {
    link = { label: link, src: link };
  }
  // 组
  if ('demos' in link) {
    link.demos.map(l => ({ lable: l, src: l }));
  }
  return link;
});

const state = {
  config,
  boxes: {},
  foldBoxes: [],
  links,
  iframeStatus: null,
  isSidebarShown: true,
  transforming: false,
  inIframe: window !== top,
  autoRun: true,
  logs: [],
  currentBox: undefined,
  dependencies: {
    js: [],
    css: []
  }
};

if (state.inIframe) {
  state.isSidebarShown = false;
}

const mutations = {
  CLEAR_BOXES(state) {
    state.boxes = {};
  },
  UPDATE_TAB(state, { type, tabName }) {
    if (!state.boxes[type]) state.boxes[type] = {};
    state.boxes[type].tabName = tabName;
  },
  UPDATE_KEY(state, { type, key }) {
    if (!state.boxes[type]) state.boxes[type] = {};
    state.boxes[type].key = key;
  },
  UPDATE_CODE(state, { type, code }) {
    if (!state.boxes[type]) state.boxes[type] = {};
    state.boxes[type].code = code;
    if (state.autoRun) bus.$emit('run');
  },
  UPDATE_TRANSFORM(state, { type, transform }) {
    if (!state.boxes[type]) state.boxes[type] = {};
    state.boxes[type].transform = transform;
  },
  UPDATE_TRANSFORMER(state, { type, transformer }) {
    if (!state.boxes[type]) state.boxes[type] = {};
    state.boxes[type].transformer = transformer;
  },
  UPDATE_EDITOR_HOOK(state, { type, editorHook }) {
    if (!state.boxes[type]) state.boxes[type] = {};
    state.boxes[type].editorHook = editorHook;
  },
  UPDATE_FOLD_BOXES(state, foldBoxes) {
    state.foldBoxes = foldBoxes;
  },
  UPDATE_VISIBLE(state, { type, visible }) {
    if (!state.boxes[type]) state.boxes[type] = {};
    state.boxes[type].visible = visible;
  },
  TOGGLE_BOX_FOLD(state, boxName) {
    const boxIndex = state.foldBoxes.indexOf(boxName);
    if (boxIndex > -1) {
      state.foldBoxes.splice(boxIndex, 1);
    } else {
      state.foldBoxes.push(boxName);
    }
  },
  SET_IFRAME_STATUS(state, status) {
    state.iframeStatus = status;
  },
  SET_TRANSFORM(state, status) {
    state.transforming = status;
  },
  TOGGLE_AUTO_RUN(state) {
    state.autoRun = !state.autoRun;
  },
  CLEAR_LOGS(state) {
    state.logs = [];
  },
  ADD_LOG(state, log) {
    state.logs.push(log);
  },
  UPDATE_DEPENDENCIES(state, dependencies = { js: [], css: [] }) {
    state.dependencies = dependencies;
  },
  TOGGLE_SIDEBAR(state) {
    state.isSidebarShown = !state.isSidebarShown;
  },
  UPDATE_CURRENT_BOX(state, box) {
    state.currentBox = box;
  }
};

const actions = {
  clearBoxes({ commit }) {
    commit('CLEAR_BOXES');
  },
  updateTab({ commit }, pl) {
    commit('UPDATE_TAB', pl);
  },
  updateKey({ commit }, pl) {
    commit('UPDATE_KEY', pl);
  },
  updateCode({ commit }, pl) {
    commit('UPDATE_CODE', pl);
  },
  updateTransformer({ commit }, pl) {
    commit('UPDATE_TRANSFORMER', pl);
  },
  updateTransform({ commit }, pl) {
    commit('UPDATE_TRANSFORM', pl);
  },
  updateEditorHook({ commit }, pl) {
    commit('UPDATE_EDITOR_HOOK', pl);
  },
  updateFoldBoxes({ commit }, pl) {
    commit('UPDATE_FOLD_BOXES', pl);
  },
  updateVisible({ commit }, pl) {
    commit('UPDATE_VISIBLE', pl);
  },
  toggleBoxFold({ commit }, pl) {
    commit('TOGGLE_BOX_FOLD', pl);
  },
  toogleAutoRun({ commit }) {
    commit('TOGGLE_AUTO_RUN');
  },
  updateDependencies({ commit }, pl) {
    commit('UPDATE_DEPENDENCIES', pl);
  },
  updateCurrentBox({ commit }, pl) {
    commit('UPDATE_CURRENT_BOX', pl);
  },
  async setBoxes({ dispatch }, demo) {
    progress.start();

    let demoID;
    if (!demoBoxes[demo]) {
      router.push({ path: '/404' });
      progress.done();
      return;
    }
    if (typeof demo === 'string') {
      demoID = demo;
      if (typeof demoBoxes[demo] === 'function') {
        demo = await demoBoxes[demo]();
      } else {
        demo = await demoBoxes[demo];
      }
    } else {
      demoID =
        'demo-' +
        Math.random()
          .toString(16)
          .slice(2, 14);
    }

    let { foldBoxes, packages, ...boxes } = demo;

    const ac = [];

    dispatch('clearBoxes');

    packages = packages || { js: [], css: [] };

    ['html', 'css', 'javascript', 'rawdata'].forEach(type => {
      if (!boxes[type] || typeof boxes[type] === 'string') {
        boxes[type] = {
          code: boxes[type] || '',
          visible: boxes[type] != null
        };
      } else if (
        boxes[type].default &&
        typeof boxes[type].default === 'string'
      ) {
        boxes[type] = {
          code: boxes[type].default,
          visible: true
        };
      } else if (typeof boxes[type].code !== 'string') {
        boxes[type].code =
          boxes[type].code != null ? boxes[type].code.default || '' : '';
      }
      boxes[type].transformer = boxes[type].transformer || type;
      boxes[type].visible = !!boxes[type].visible;
    });

    Object.entries(boxes).forEach(
      ([
        type,
        { tabName, code, transformer, visible, transform, editorHook }
      ]) => {
        transform =
          transform ||
          function(code) {
            return code;
          };
        ac.push(
          dispatch('updateTab', { type, tabName }),
          dispatch('updateKey', { type, key: demoID }),
          dispatch('updateCode', { type, code }),
          dispatch('updateTransformer', { type, transformer }),
          dispatch('updateTransform', { type, transform }),
          dispatch('updateVisible', { type, visible: Boolean(visible) }),
          dispatch('updateEditorHook', { type, editorHook })
        );
      }
    );

    const dependencies = {
      js: [...(config.globalPackages.js || []), ...(packages.js || [])],
      css: [...(config.globalPackages.css || []), ...(packages.css || [])]
    };

    ac.push(dispatch('updateFoldBoxes', foldBoxes || []));
    ac.push(dispatch('updateDependencies', dependencies));
    ac.push(
      dispatch(
        'updateCurrentBox',
        Object.entries(boxes).find(([key, value]) => value.visible)[0] ||
          undefined
      )
    );
    await Promise.all(ac);
    progress.done();
  },
  setIframeStatus({ commit }, status) {
    commit('SET_IFRAME_STATUS', status);
  },
  transform({ commit }, status) {
    commit('SET_TRANSFORM', status);
  },
  clearLogs({ commit }) {
    commit('CLEAR_LOGS');
  },
  addLog({ commit }, pl) {
    commit('ADD_LOG', pl);
  }
};

const store = new Vuex.Store({
  state,
  mutations,
  actions
});

bus.$on('setBoxes', demo => {
  store.dispatch('setBoxes', demo);
});

export default store;
