import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import axios from "axios"
import store from "./store"

export const axiosInstance = axios.create()

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${store.getters["auth/getToken"]}`
    return config
  },
  function (response) {
    return response
  },
  async function (error) {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    console.log("axios interceptor", error)
    if (error.code === "ERR_NETWORK") {
      window.location.href = "/network-error"
      return Promise.reject(error)
    }
    switch (error.response.status) {
      case 500:
        await router.replace({ name: "server-error" })
        break
      default:
        store.commit("errors/setErrorList", {
          errorStatus: error.status,
          errorMessage: error.response.data,
        })
        console.log("axios interceptor", error)
        return Promise.reject(error)
    }
  },
)

const app = createApp(App).use(router).use(store)

app.config.globalProperties.$axios = axiosInstance

app.mount("#app")

export default app
