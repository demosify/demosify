import Vue from 'vue/dist/vue.esm';
import Vuex from 'vuex';
import userConfig from 'manifest';
import clonedeep from 'lodash.clonedeep';
import demoList from '.demoList.json';
import router from '@/js/router.js';
import bus from '@/js/eventbus.js';

const config = Object.assign({
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
    css: [],
  },
  // tab waterfall
  editorViewMode: 'tab',
}, userConfig);

import progress from 'nprogress';
progress.configure({
  showSpinner: false,
});

const path = require('path');

Vue.use(Vuex);

const demoBoxes = {};

function importAllDemo(r) {
  r.keys().forEach(key => {
    const name = /^\.\/(.+)\//.exec(key)[1];
    demoBoxes[name] = r(key).default;
  })
}
importAllDemo(require.context('demos', true, /config.js$/));

const state = {
  config,
  boxes: {},
  foldBoxes: [],
  links: demoList,
  iframeStatus: null,
  transforming: false,
  isSidebarShown: true,
  autoRun: true,
  logs: [],
  currentBox: undefined,
  dependencies: {
    js: [],
    css: [],
  },
};

const mutations = {
  CLEAR_BOXES(state) {
    state.boxes = {};
  },
  UPDATE_CODE(state, {type, code}) {
    if(!state.boxes[type]) state.boxes[type] = {};
    state.boxes[type].code = code;
    if(state.autoRun) bus.$emit('run');
  },
  UPDATE_TRANSFORM(state, {type, transform}) {
    if(!state.boxes[type]) state.boxes[type] = {};
    state.boxes[type].transform = transform;    
  },
  UPDATE_TRANSFORMER(state, {type, transformer}) {
    if(!state.boxes[type]) state.boxes[type] = {};
    state.boxes[type].transformer = transformer;
  },
  UPDATE_EDITOR_HOOK(state, {type, editorHook}) {
    if(!state.boxes[type]) state.boxes[type] = {};
    state.boxes[type].editorHook = editorHook;
  },
  UPDATE_FOLD_BOXES(state, foldBoxes) {
    state.foldBoxes = foldBoxes;
  },
  UPDATE_VISIBLE(state, {type, visible}) {
    if(!state.boxes[type]) state.boxes[type] = {};
    state.boxes[type].visible = visible;
  },
  TOGGLE_BOX_FOLD(state, boxName) {
    const boxIndex = state.foldBoxes.indexOf(boxName);
    if(boxIndex > -1) {
      state.foldBoxes.splice(boxIndex, 1);
    } else {
      state.foldBoxes.push(boxName);
    }
  },
  SET_IFRAME_STATUS(state, status) {
    state.iframeStatus = status
  },
  SET_TRANSFORM(state, status) {
    state.transforming = status
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
  UPDATE_DEPENDENCIES(state, dependencies = {js: [], css: []}) {
    state.dependencies = dependencies;
  },
  TOGGLE_SIDEBAR(state) {
    state.isSidebarShown = !state.isSidebarShown;
  },
  UPDATE_CURRENT_BOX(state, box) {
    state.currentBox = box;
  },
};

const actions =  {
  clearBoxes({commit}) {
    commit('CLEAR_BOXES');
  },
  updateCode({commit}, pl) {
    commit('UPDATE_CODE', pl);
  },
  updateTransformer({commit}, pl) {
    commit('UPDATE_TRANSFORMER', pl);
  },
  updateTransform({commit}, pl) {
    commit('UPDATE_TRANSFORM', pl);
  },
  updateEditorHook({commit}, pl) {
    commit('UPDATE_EDITOR_HOOK', pl);
  },
  updateFoldBoxes({commit}, pl) {
    commit('UPDATE_FOLD_BOXES', pl);
  },
  updateVisible({commit}, pl) {
    commit('UPDATE_VISIBLE', pl)
  },
  toggleBoxFold({commit}, pl) {
    commit('TOGGLE_BOX_FOLD', pl);
  },
  toogleAutoRun({commit}) {
    commit('TOGGLE_AUTO_RUN');
  },
  updateDependencies({commit}, pl) {
    commit('UPDATE_DEPENDENCIES', pl);
  },
  updateCurrentBox({commit}, pl) {
    commit('UPDATE_CURRENT_BOX', pl);
  },
  async setBoxes({dispatch}, demo) {
    progress.start();

    if(!demoBoxes[demo]) {
      router.push({path : '/404'});
      progress.done();
      return;
    }
    if(typeof demo === 'string') {
      demo = await demoBoxes[demo]();
    }
    

    const{foldBoxes, visibleBoxes, packages, ...boxes} = demo;

    const ac = [];

    dispatch('clearBoxes');

    Object.entries(boxes).forEach(([type, {code, transformer, visible, transform, editorHook}]) => {
      transform = transform || function(code) {return code};
      ac.push(
        dispatch('updateCode', { type, code: code.default }),
        dispatch('updateTransformer', { type, transformer }),
        dispatch('updateTransform', { type, transform }),
        dispatch('updateVisible', {type, visible: Boolean(visible)}),
        dispatch('updateEditorHook', {type, editorHook}),
      );
    })
  

    const dependencies = {
      js: [
        ...(config.globalPackages.js || []) ,
        ...(packages.js || []),
      ],
      css: [
        ...(config.globalPackages.css || []) ,
        ...(packages.css || []),
      ],
    };

    ac.push(dispatch('updateFoldBoxes', foldBoxes || []));
    ac.push(dispatch('updateDependencies', dependencies));
    ac.push(dispatch('updateCurrentBox', Object.entries(boxes).find(([key, value]) => value.visible)[0]|| undefined));
    await Promise.all(ac);
    progress.done();
  },
  setIframeStatus({ commit }, status) {
    commit('SET_IFRAME_STATUS', status)
  },
  transform({ commit }, status) {
    commit('SET_TRANSFORM', status)
  },
  clearLogs({commit}) {
    commit('CLEAR_LOGS');
  },
  addLog({commit}, pl) {
    commit('ADD_LOG', pl)
  },
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
});

bus.$on('setBoxes', (demo) => {store.dispatch('setBoxes', demo)})


export default store;
