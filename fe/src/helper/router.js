import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/layout/Layout.vue";
import { getAccessToken } from "@/composables/useLocalStorage";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/dashboard",
      component: AppLayout,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: () => import("@/views/dashboard/Dashboard.vue"),
        },
        {
          path: "/device/:id",
          name: "device",
          component: () => import("@/views/device/Device.vue"),
        },
        {
          path: "/home",
          name: "home",
          component: () => import("@/views/home/Home.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/auth/Login.vue"),
    },
    {
      path: "/",
      name: "index page",
      component: () => import("@/views/index.vue"),
    },
  ],
});

const isLogin = getAccessToken();

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isLogin) {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
