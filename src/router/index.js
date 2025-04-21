import { createRouter, createWebHistory } from "vue-router"
import Monitoring from "@/components/monitoring/Monitoring.vue"
import KioskPage from "@/components/electronic_queue/KioskPage.vue"
import store from "@/store/index.js"

const routes = [
  {
    path: "",
    name: "monitoring",
    component: Monitoring,
    // children: [
    //     {
    //         path: "navigation",
    //         name: "navigation",
    //         component: NavigationPage,
    //     },
    // ],
  },
  {
    path: "/kiosk",
    name: "kiosk",
    component: KioskPage,
    // children: [
    //     {
    //         path: "navigation",
    //         name: "navigation",
    //         component: NavigationPage,
    //     },
    // ],
  },

  // {
  //     path: "/network-error",
  //     component: NetworkErrorView,
  //     name: "network-error",
  // },
  // {
  //     path: "/server-error",
  //     component: ServerErrorView,
  //     name: "server-error",
  // },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from) => {
  await store.dispatch("auth/actionCheckLoggedIn")
  const isLoggedIn = store.getters["auth/getIsLoggedIn"]

  if (to.meta.requiresAuth && !isLoggedIn) {
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    }
  }
})

export default router
