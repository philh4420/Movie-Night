import { createRouter, createWebHistory } from "vue-router";

// Import the pages
import Home from "@/pages/Home.vue";
import Poll from "@/pages/Poll.vue";
import Details from "@/pages/Details.vue";
import About from "@/pages/About.vue";

// Define routes
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/pages/Home.vue"), // Lazy load Home Page
  },
  {
    path: "/poll",
    name: "Poll",
    component: () => import("@/pages/Poll.vue"), // Lazy load Poll Page
  },
  {
    path: "/movie/:id",
    name: "Details",
    component: () => import("@/pages/Details.vue"), // Lazy load Details Page
    props: true, // Pass route params as props
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/pages/About.vue"), // Lazy load About Page
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/pages/NotFound.vue"), // Lazy load NotFound page
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(), // Use HTML5 history mode
  routes,
});

export default router;