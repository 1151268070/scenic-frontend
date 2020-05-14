import Vue from "vue";
import VueRouter from "vue-router";
import childrenRouter from './childrenRouter';

Vue.use(VueRouter);
let mainRouteChildren = [];
mainRouteChildren = mainRouteChildren.concat(childrenRouter);
const routes = [
  {
    path: "/",
    name: "MainV2",
    component: () => import('../pages/MainV2'),
    children: mainRouteChildren,
    meta: {
      ignoreLoginAuth: true,
      title: '首页',
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../pages/About.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
