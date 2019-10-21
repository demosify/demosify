import _demoList from '.demoList.json';
import Vue from 'vue/dist/vue.esm';
import VueRouter from 'vue-router';
import bus from '@/js/eventbus.js';

import VesselPage from '@/pages/vessel.vue';
import NotFoundPage from '@/pages/notFound.vue';

Vue.use(VueRouter);

let demoList = _demoList.map(demo => {
  if (demo.demos) {
    return demo.demos.map(child => {
      if (typeof child !== 'string') child = demo.src + '/' + child.src;
      return child;
    });
  }
  if (typeof demo !== 'string') demo = demo.src;
  return demo;
});

demoList = demoList.flat();

const demoRoutes = demoList.map(demoName => ({
  name: demoName,
  path: `/${demoName}`,
  component: VesselPage
}));

const defaultRoute = {
  path: '/',
  redirect: { name: demoList[0] }
};

const nfpRoute = {
  path: '/404',
  component: NotFoundPage
};

const unexistRouter = {
  path: '*',
  component: NotFoundPage
};

const routes = [defaultRoute, ...demoRoutes, nfpRoute, unexistRouter];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name && demoList.indexOf(to.name) > -1) {
    bus.$emit('setBoxes', to.name);
  } else if (to.name) {
    router.push({ path: '/404' });
  }
  next();
});

window.router = router;
export default router;
