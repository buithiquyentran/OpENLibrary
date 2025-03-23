import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import BookManagement from "@/views/BookManagement.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/books",
    name: "books",
    component: () => import("@/views/BookManagement.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/publishers",
    name: "publishers",
    component: () => import("@/views/PublisherManagement.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/readers",
    name: "readers",
    component: () => import("@/views/ReaderManagement.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/staffs",
    name: "staffs",
    component: () => import("@/views/StaffManagement.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

import AuthService from "@/services/auth.service";
router.beforeEach(async (to, from, next) => {
  try {
    const response = await AuthService.getUserInfo();
    const ROLE = response.ROLE;
    // alert(ROLE);
    if (!ROLE || (ROLE !== 0 && ROLE !== 1)) {
      window.location.href = "http://localhost:5173/login"; // Quay về trang user
    } else {
      next();
    }
  } catch (error) {
    window.location.href = "http://localhost:5173/login"; // Quay về trang user
  }
});
export default router;
