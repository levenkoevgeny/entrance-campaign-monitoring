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
      case 401:
        if (error.response.data.code) {
          store.commit("errors/setErrorList", {
            errorCode: "token_not_valid",
            errorStatus: error.status,
            errorMessage: "Ошибка авторизации",
          })
        } else {
          store.commit("errors/setErrorList", {
            errorStatus: error.status,
            errorMessage: "Ошибка авторизации",
          })
        }

        await store.dispatch("auth/actionRemoveLogIn")
        await router.replace({ name: "login" })
        break
      case 403:
        store.commit("errors/setErrorList", {
          errorStatus: error.status,
          errorMessage: "У Вас нет прав для просмотра этого ресурса",
        })
        await store.dispatch("auth/actionRemoveLogIn")
        await router.replace({ name: "login" })
        break
      case 404:
        store.commit("errors/setErrorList", {
          errorStatus: error.status,
          errorMessage: "URL Not found",
        })
        return Promise.reject(error)
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
