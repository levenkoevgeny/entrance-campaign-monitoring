import { createRouter, createWebHistory } from "vue-router"
import Monitoring from "@/components/monitoring/Monitoring.vue"
import KioskPage from "@/components/electronic_queue/KioskPage.vue"
import QueueMonitoringView from "@/components/electronic_queue/QueueMonitoringView/QueueMonitoringView.vue"
import StartPage from "@/components/StartPage.vue"
import QueueList from "@/components/electronic_queue/QueueMonitoringView/QueueList.vue"

const routes = [
  {
    path: "",
    name: "start-page",
    component: StartPage,
  },
  {
    path: "/monitoring",
    name: "monitoring",
    component: Monitoring,
  },
  {
    path: "/kiosk",
    name: "kiosk",
    component: KioskPage,
  },
  {
    path: "/queue-list",
    name: "queue-list",
    component: QueueList,
  },
  {
    path: "/queue/:queue/monitoring",
    name: "queue-monitoring",
    component: QueueMonitoringView,
  },

  // {
  //     path: "/network-error",
  //     component: NetworkErrorView,
  //     name: "network-error",
  // },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
export default router
