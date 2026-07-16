import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";
import Adminlayouts from "@/layouts/AdminLayouts.vue";
import Index from "@/views/HeadOfFamily/Index.vue";
import Create from "@/views/HeadOfFamily/Create.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        guest: true,
      },
    },
    {
      path: "/",
      component: Adminlayouts,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "/",
          name: "dashboard",
          component: Dashboard,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/head-of-family",
          name: "head-of-family",
          component: Index,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/head-of-family/create",
          name: "head-of-family-create",
          component: Create,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/family-member",
          name: "family-member",
          component: Index,
          meta: {
            requiresAuth: true,
          },
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    return "/login";
  }

  if (to.meta.guest && token) {
    return "/";
  }

  return true;
});

export default router;
