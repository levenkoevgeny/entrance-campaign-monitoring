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
    <div v-if="freeTicket">
      <div
        style="height: 100vh"
        class="d-flex justify-content-center align-items-center flex-column"
      >
        <h1 style="font-size: 100px">Ваш номер талона</h1>
        <h1 style="font-size: 200px">{{ freeTicket.ticket_number_verbose }}</h1>
      </div>
    </div>
    <div v-else>
      <div v-if="queueList.results.length === 1">
        <div
          style="height: 100vh"
          class="d-flex justify-content-center align-items-center"
        >
          <button
            class="btn btn-primary"
            style="height: 20vh; width: 30vw; font-size: 70px"
            @click="getNextFreeTicket(queueList.results[0].id)"
          >
            {{ queueList.results[0].queue_name }}
          </button>
        </div>
      </div>
      <div v-else>
        <div
          class="d-flex flex-column justify-content-center align-items-center mt-4"
          style="height: 90vh; max-height: 90vh; overflow-y: auto"
        >
          <button
            class="btn btn-primary fs-1 mb-3"
            style="height: 20vh; width: 30vw"
            v-for="queue in queueList.results"
            :key="queue.id"
            @click="getNextFreeTicket(queue.id)"
          >
            {{ queue.queue_name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getQueueAPIInstance from "@/api/electronic_queue/queueAPI.js"
import axios from "axios"

export default {
  name: "KioskPage",
  components: {},
  data() {
    return {
      queueList: { count: 0, results: [], previous: null, next: null },
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
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.isLoading = true
      const response = await axios(
        `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/queues/`,
      )

      this.queueList = await response.data
      this.isLoading = false
    },
    async getNextFreeTicket(queueId) {
      this.isLoading = true
      const response = await axios(
        `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/queues/${queueId}/get_next_free_ticket/`,
      )
      this.freeTicket = response.data
      setTimeout(() => {
        print()
      }, 500)

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
