import axios from "axios"

export const monitoringAPI = {
  async getJSON() {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/monitoring-data/`,
      {},
    )
  },
}
