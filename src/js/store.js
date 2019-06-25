import Vue from 'vue/dist/vue.esm';
import Vuex from 'vuex';
import config from '@/manifest';
import clonedeep from 'lodash.clonedeep';
import demoList from '@/.demoList.json';
import router from '@/js/router.js';
import bus from '@/js/eventbus.js';

import progress from 'nprogress'
const path = require('path');

Vue.use(Vuex);

const demoBoxes = {};

function importAllDemo(r) {
  r.keys().forEach(key => {
    const name = /^\.\/(.+)\//.exec(key)[1];
    demoBoxes[name] = r(key).default;
  })
}
importAllDemo(require.context('@/demos', true, /config.js$/));

const state = {
  config,
  boxes: {},
  foldBoxes: [],
  links: demoList,
  iframeStatus: null,
  transforming: false,
  autoRun: true,
};

const mutations = {
  CLEAR_BOXES(state) {
    state.boxes = {};
  },
  UPDATE_CODE(state, {type, code}) {
    if(!state.boxes[type]) state.boxes[type] = {};
    state.boxes[type].code = code;
    bus.$emit('run');
  },
  UPDATE_TRANSFORMER(state, {type, transformer}) {
    if(!state.boxes[type]) state.boxes[type] = {};
    state.boxes[type].transformer = transformer;
  },
  UPDATE_FOLD_BOX(state, foldBoxes) {
    state.foldBoxes = foldBoxes;
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
  TOOGLE_AUTO_UPDATE(state) {
    state.autoRun = !state.autoRun;
  }
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
  updateFoldBox({commit}, pl) {
    commit('UPDATE_FOLD_BOX', pl);
  },
  toggleBoxFold({commit}, pl) {
    commit('TOGGLE_BOX_FOLD', pl);
  },
  toogleAutoRun({commit}) {
    commit('TOGGLE_AUTO_RUN');
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
    

    const{foldBoxes, ...boxes} = demo;

    const ac = [];

    dispatch('clearBoxes');

    Object.entries(boxes).forEach(([type, {code, transformer}]) => {
      ac.push(
        dispatch('updateCode', { type, code: code.default }),
        dispatch('updateTransformer', { type, transformer }),
      );
    })

    ac.push(dispatch('updateFoldBox', foldBoxes));

    await Promise.all(ac);
    // bus.$emit('run');
    progress.done();
  },
  setIframeStatus({ commit }, status) {
    commit('SET_IFRAME_STATUS', status)
  },
  transform({ commit }, status) {
    commit('SET_TRANSFORM', status)
  },
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
});

bus.$on('setBoxes', (demo) => {store.dispatch('setBoxes', demo)})


export default store;
