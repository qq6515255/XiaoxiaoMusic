import Vue from "vue";
import VueRouter from "vue-router";

const Home = () => import("../views/Home.vue");
const HomeRecommend = () => import("../views/HomeRecommend.vue");
const HomeHot = () => import("../views/HomeHot.vue");
const HomeSearch = () => import("../views/HomeSearch.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    redirect: "/recommend",
    children: [
      {
        // Home下的子路由
        path: "/recommend",
        component: HomeRecommend
      },
      {
        // Home下的子路由
        path: "/hot",
        component: HomeHot
      },
      {
        // Home下的子路由
        path: "/search",
        component: HomeSearch
      }
    ]
  },
  {
    path: "/PlayList",
    name: "playlist",
    component: () => import("../views/PlayList.vue")
  },
  {
    path: "/Singer",
    name: "singer",
    component: () => import("../views/Singer.vue")
  },

];

const router = new VueRouter({
  routes
});

export default router;
