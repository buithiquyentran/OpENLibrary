import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
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
    component: () => import("@/views/Books.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/Profile.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/history",
    name: "history",
    component: () => import("@/views/History.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
