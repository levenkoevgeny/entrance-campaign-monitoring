<template>
  <navigation-layout></navigation-layout>
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
      <div class="my-5">
        <button
          class="btn btn-primary"
          @click="$router.push({ name: 'queue-list' })"
        >
          Вернуться к списку очередей
        </button>
      </div>

      <button class="btn btn-primary" @click="getNextTicketToProcess">
        Вызвать следующего
      </button>

      <table>
        <thead></thead>
        <tbody>
          <tr v-for="ticket in ticketList.results">
            <td>{{ ticket.ticket_number_verbose }}</td>
            <td>
              {{
                new Date(ticket.date_time_created).toLocaleString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              }}
            </td>
            <td><button class="btn btn-danger">Завершить</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import getQueueAPIInstance from "@/api/electronic_queue/queueAPI.js"
import getTicketAPIInstance from "@/api/electronic_queue/ticketAPI.js"
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"
import { mapGetters } from "vuex"

export default {
  name: "QueueProcessingView",
  components: { NavigationLayout },
  data() {
    return {
      currentQueue: null,
      ticketList: { count: 0, results: [], previous: null, next: null },
      isLoading: true,
      isError: false,
      ticketAPIInstance: getTicketAPIInstance(),
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
      this.ticketAPIInstance.searchObj.queue = this.$route.params.id
      this.ticketAPIInstance.searchObj.operator = this.user.id
      const response = await this.ticketAPIInstance.getItemsList()
      this.ticketList = await response.data
      // const response = await axios(
      //   `${this.BACKEND_PROTOCOL}://${this.BACKEND_HOST}:${this.BACKEND_PORT}/api/queues/`,
      // )
      //
      // this.queueList = await response.data
      this.isLoading = false
    },
    async getNextTicketToProcess() {
      this.isLoading = true

      const response = await this.queueAPIInstance.getNextTicketToProcess(
        this.$route.params.id,
      )

      this.isLoading = false
    },
  },
  computed: {
    ...mapGetters({
      user: "auth/getUser",
    }),
  },
}
</script>

<style scoped></style>
