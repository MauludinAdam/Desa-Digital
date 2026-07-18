import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";
import Adminlayouts from "@/layouts/AdminLayouts.vue";
import HeadOfFamilyIndex from "@/views/HeadOfFamily/HeadOfFamilyIndex.vue";
import FamilyMemberIndex from "@/views/FamilyMember/FamilyMemberIndex.vue";
import HeadOfFamilyDetail from "@/views/HeadOfFamily/HeadOfFamilyDetail.vue";
import HeadOfFamilyCreate from "@/views/HeadOfFamily/HeadOfFamilyCreate.vue";
import HeadOfFamilyEdit from "@/views/HeadOfFamily/HeadOfFamilyEdit.vue";

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
        // menu head of Family starts
        {
          path: "/head-of-family",
          name: "head-of-family",
          component: HeadOfFamilyIndex,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/head-of-family/create",
          name: "head-of-family-create",
          component: HeadOfFamilyCreate,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/head-of-family/detail/:id",
          name: "head-of-family.detail",
          component: HeadOfFamilyDetail,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/head-of-family/edit/:id",
          name: "head-of-family.edit",
          component: HeadOfFamilyEdit,
          meta: {
            requiresAuth: true,
          },
        },

        // menu head of family end
        {
          path: "/family-member",
          name: "family-member",
          component: FamilyMemberIndex,
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
