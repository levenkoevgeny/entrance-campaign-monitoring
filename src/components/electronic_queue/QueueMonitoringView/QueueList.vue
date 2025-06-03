<template>
  <div class="container">
    <div class="my-4"></div>
    <div v-for="queue in queueList.results" :key="queue.id" class="m-2 p-2">
      <router-link
        :to="{ name: 'queue-monitoring', params: { queue: queue.id } }"
        class="list-group-item list-group-item-action rounded-1 p-3"
      >
        {{ queue.queue_name }}
      </router-link>
      <br />
    </div>
  </div>
</template>

<script>
import getQueueAPIInstance from "@/api/electronic_queue/queueAPI.js"
import axios from "axios"

export default {
  name: "QueueList",
  data() {
    return {
      queueList: { count: 0, results: [], previous: null, next: null },
      queueAPIInstance: getQueueAPIInstance(),
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const response = await axios(
          `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/queues/`,
        )
        this.queueList = await response.data
      } catch (e) {
        alert("Error")
      }
    },
  },
}
</script>

<style scoped></style>
