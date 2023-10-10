import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    children: [],
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/home.vue"),
    redirect: "/home/overview",
    children: [
      {
        path: "overview",
        name: "overview",
        component: () => import("@/views/pages/overview.vue"),
        children: [],
      },
      {
        path: "user",
        name: "user",
        component: () => import("@/views/pages/user.vue"),
        children: [],
      },
      {
        path: "lesson",
        name: "lesson",
        component: () => import("@/views/pages/lesson.vue"),
        children: [],
      },
      {
        path: "creator",
        name: "creator",
        component: () => import("@/views/pages/creator.vue"),
        children: [],
      },
      {
        path: "manager",
        name: "manager",
        component: () => import("@/views/pages/manager.vue"),
        children: [],
      },
      {
        path: "log",
        name: "log",
        component: () => import("@/views/pages/log.vue"),
        children: [],
      },
    ],
  },
];
const routerHistory = createWebHashHistory();
const router = createRouter({
  history: routerHistory,
  routes,
});
//全局后置守卫
router.afterEach((to, from, failure) => {
  if (window.parent != window.self && from.fullPath !== "/") {
    window.parent.postMessage({ url: location.href }, "*");
    localStorage.setItem("url", to.fullPath);
  }
});
export default router;
