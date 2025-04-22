<template>
  <div
    v-if="isLoading"
    style="height: 100vh"
    class="d-flex justify-content-center align-items-center"
  >
    <div class="spinner-grow" style="width: 5rem; height: 5rem" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else>
    <div class="container">
      <div class="my-5"></div>
      <table class="table">
        <thead>
          <tr>
            <th>Номер талона</th>
            <th>Оператор</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in ticketsList.results" :key="ticket.id">
            <td>{{ ticket.ticket_number_verbose }}</td>
            <td>{{ ticket.operator }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import getQueueAPIInstance from "@/api/electronic_queue/queueAPI.js"
import axios from "axios"

export default {
  name: "QueueMonitoringView",
  components: {},
  data() {
    return {
      ticketsList: { count: 0, results: [], previous: null, next: null },
      isLoading: true,
      isError: false,
      queueAPIInstance: getQueueAPIInstance(),
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
      freeTicket: null,
      interval: null,
    }
  },
  async created() {
    setInterval(async () => await this.loadData(), 5000)
  },
  methods: {
    async loadData() {
      this.isLoading = true
      const response = await axios(
        `${this.BACKEND_PROTOCOL}://${this.BACKEND_HOST}:${this.BACKEND_PORT}/api/tickets/?ticket_state=1`,
      )

      this.ticketsList = await response.data
      this.isLoading = false
    },
    async getNextFreeTicket(queueId) {
      this.isLoading = true
      const response = await axios(
        `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/queues/${queueId}/get_next_free_ticket/`,
      )
      this.freeTicket = response.data
      this.interval = setTimeout(() => {
        this.freeTicket = null
        this.interval = null
      }, 5000)
      this.isLoading = false
    },
  },
}
</script>

<style scoped></style>
