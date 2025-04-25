import { createRouter, createWebHistory } from "vue-router"
import Monitoring from "@/components/monitoring/Monitoring.vue"
import KioskPage from "@/components/electronic_queue/KioskPage.vue"
import QueueMonitoringView from "@/components/electronic_queue/QueueMonitoringView/QueueMonitoringView.vue"
import QueueProcessingView from "@/components/electronic_queue/QueueProcessingView.vue"
import AdminQueueListView from "@/components/electronic_queue/AdminQueueListView.vue"

import LoginView from "@/components/auth/LoginView.vue"
import store from "@/store/index.js"

const routes = [
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
export default router
