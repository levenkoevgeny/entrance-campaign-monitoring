<template>
  <div>
    <div class="container">
      <div class="my-5"></div>
      <table class="table" style="font-size: 50px">
        <thead>
          <tr>
            <th class="text-center">Номер талона</th>
            <th class="text-center">Оператор</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in ticketsList.results" :key="ticket.id">
            <td
              :class="{ 'new-ticket-pulsate': ticket.isNewTicket }"
              class="text-center"
            >
              {{ ticket.ticket_number_verbose }}
            </td>
            <td class="text-center">{{ ticket.get_operator_workplace }}</td>
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
  name: "QueueComponent",
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
      currentTime: new Date(),
      utterance: new SpeechSynthesisUtterance(),
      voice_15: window.speechSynthesis.getVoices()[100],
      timeInterval: null,
      loadDataInterval: null,
    }
  },
  async created() {
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date()
    }, 1000)

    await this.loadData()
    this.loadDataInterval = setInterval(async () => {
      await this.loadData()
    }, 5000)
  },
  unmounted() {
    clearInterval(this.timeInterval)
    clearInterval(this.loadDataInterval)
  },
  methods: {
    async loadData() {
      this.isLoading = true
      let oldTicketList = this.ticketsList.results
      const response = await axios(
        `${this.BACKEND_PROTOCOL}://${this.BACKEND_HOST}:${this.BACKEND_PORT}/api/tickets/?ticket_state=1`,
      )
      const newListFromServer = response.data
      this.ticketsList = newListFromServer
      let voice_text = ""
      newListFromServer.results.map((item) => {
        if (!this.checkIfTicketListIncludeItem(oldTicketList, item)) {
          item.isNewTicket = true
        }
      })

      this.voiceText = voice_text
      // this.speak()
      this.isLoading = false
    },

    checkIfTicketListIncludeItem(checkingArray, checkingItem) {
      return (
        checkingArray.filter((item) => item.id === checkingItem.id).length > 0
      )
    },
  },
}
</script>

<style scoped>
@keyframes pulsate {
  50% {
    text-shadow:
      0 -1px rgba(0, 0, 0, 0.3),
      0 0 5px #f0bc00,
      0 0 8px #f0bc00;
  }
}
.new-ticket-pulsate {
  text-shadow: 0 -1px rgba(0, 0, 0, 0.1);
  font-size: 50px;
  text-decoration: none;
  -webkit-animation: pulsate 1.2s linear infinite;
  animation: pulsate 1.2s linear infinite;
  animation-iteration-count: 5;
}

.amia-header {
  color: white;
  background-image: linear-gradient(94deg, #213852, #085273);
}
</style>
