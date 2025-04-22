import { createRouter, createWebHistory } from "vue-router"
import Monitoring from "@/components/monitoring/Monitoring.vue"
import KioskPage from "@/components/electronic_queue/KioskPage.vue"
import QueueMonitoringView from "@/components/electronic_queue/QueueMonitoringView.vue"
import QueueProcessingView from "@/components/electronic_queue/QueueProcessingView.vue"
import AdminQueueListView from "@/components/electronic_queue/AdminQueueListView.vue"

import LoginView from "@/components/auth/LoginView.vue"
import store from "@/store/index.js"

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false },
  },

  {
    path: "",
    name: "monitoring",
    component: Monitoring,
  },
  {
    path: "/kiosk",
    name: "kiosk",
    component: KioskPage,
  },
  {
    path: "/queue-monitoring",
    name: "queue-monitoring",
    component: QueueMonitoringView,
  },
  {
    path: "/queue-list",
    name: "queue-list",
    component: AdminQueueListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/queue-list:id/processing",
    component: QueueProcessingView,
    name: "queue-processing",
    meta: { requiresAuth: true },
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
