import _demoList from '.demoList.json';
import Vue from 'vue/dist/vue.esm';
import VueRouter from 'vue-router';
import bus from '@/js/eventbus.js';

import VesselPage from '@/pages/vessel.vue';
import NotFoundPage from '@/pages/notFound.vue';
// 解决重复点击路由报错的BUG
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(VueRouter);



// list(_demoList)
let demoList = _demoList.map(demo => {
  if (demo.demos) {
    return demo.demos.map(child => {
      console.log('child.demos', child.demos)
      if (child.demos) {
        return child.demos.map(childs => {
          if (typeof childs !== 'string') childs = demo.src + '/' + child.src + '/' + childs.src;
          return childs;
        });
      }
      else if (typeof child !== 'string') child = demo.src + '/' + child.src;
      return child;
    });
  }
  if (typeof demo !== 'string') demo = demo.src;
  return demo;
});

demoList = demoList.flat(Infinity);


const demoRoutes = demoList.map(demoName => ({
  name: demoName,
  path: `/${demoName}`,
  component: VesselPage
}));
console.log('demoList之前处理完的==>', demoList, demoRoutes)

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

console.log('routes', routes);
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
