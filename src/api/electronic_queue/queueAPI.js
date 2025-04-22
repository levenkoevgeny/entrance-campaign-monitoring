import BaseAPI from "@/api/baseAPIClass"
import { axiosInstance as axios } from "@/main.js"

class queueAPI extends BaseAPI {
  async getNextTicketToProcess(queueId) {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/${queueId}/get_next_ticket_to_process/`,
    )
  }
}

export default function getQueueAPIInstance() {
  return new queueAPI(
    "queues",
    {
      queue_name__icontains: "",
      queue_liter__icontains: "",
    },
    {
      queue_name: "",
      queue_liter: "",
    },
  )
}
