import { createRouter, createWebHistory } from "vue-router"
import Monitoring from "@/components/Monitoring.vue";

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