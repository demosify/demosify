import '@/css/index.scss';
import Vue from 'vue/dist/vue.esm';
import store from '@/js/store';
import router from '@/js/router';

import Main from '@/main.vue';

if (process.env.NODE_ENV == 'development') {
  Vue.config.devtools = true;
} else {
  Vue.config.devtools = false;
}

new Vue({
  render: h => h(Main),
  store,
  router,
}).$mount('#app');


