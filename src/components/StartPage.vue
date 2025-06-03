<template>
  <div class="container">
    <div class="list-group my-3">
      <router-link
        class="list-group-item list-group-item-action rounded-1"
        :to="{ name: 'kiosk' }"
      >
        Киоск
      </router-link>
      <br />
      <router-link
        class="list-group-item list-group-item-action rounded-1"
        :to="{ name: 'monitoring' }"
      >
        Мониторинг вступительной кампании
      </router-link>
      <br />
      <router-link
        class="list-group-item list-group-item-action rounded-1"
        :to="{ name: 'queue-list' }"
      >
        Мониторинг электронной очереди
      </router-link>
      <br />
    </div>
  </div>
</template>

<script>
import axios from "axios"

export default {
  name: "StartPage",
  components: {},
  data() {
    return {
      isLoading: true,
      isError: false,
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
        this.freeTicket = null
        this.interval = null
      }, 100)

      // this.interval = setTimeout(() => {
      //   this.freeTicket = null
      //   this.interval = null
      // }, 4000)
      this.isLoading = false
    },
  },
}
</script>

<style scoped></style>
