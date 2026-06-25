<template>
  <div>
    <div class="container">
      <div class="my-5"></div>

      <div
        class="d-flex flex-wrap flex-column"
        style="
          font-size: 70px;
          max-height: calc(100vh - 400px);
          background-color: white;
        "
      >
        <!--        <div class="d-flex flex-row">-->
        <!--          <div class="text-center col-4">Номер талона</div>-->
        <!--          <div class="text-center col-4"></div>-->
        <!--          <div class="text-center col-4">Оператор</div>-->
        <!--        </div>-->
        <div
          class="d-flex flex-row"
          v-for="ticket in ticketsList.results"
          :key="ticket.id"
          style="height: 100px"
        >
          <div
            class="text-center col-4"
            :class="{ 'new-ticket-pulsate': ticket.isNewTicket }"
          >
            {{ ticket.ticket_number_verbose }}
          </div>
          <div
            class="text-center col-4"
            :class="{ 'new-ticket-pulsate': ticket.isNewTicket }"
          >
            &rarr;
          </div>
          <div
            class="text-center col-4"
            :class="{ 'new-ticket-pulsate': ticket.isNewTicket }"
          >
            {{ ticket.get_operator_workplace }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getQueueAPIInstance from "@/api/electronic_queue/queueAPI.js"
import axios from "axios"
import queue from "@/PromiseQueue.js"

export default {
  name: "QueueComponent",
  components: {},
  props: {
    queue: {
      type: String,
      required: true,
    },
    playNotification: {
      type: Function,
      required: true,
    },
  },
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
      timeInterval: null,
      loadDataInterval: null,
      newTicketsArray: [],
      // speechInterval: null,
      // newTicketsArray: [],
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
    // this.speechInterval = setInterval(async () => {
    //   console.log(this.newTicketsArray.shift())
    // }, 1000)
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
        `${this.BACKEND_PROTOCOL}://${this.BACKEND_HOST}:${this.BACKEND_PORT}/api/tickets/?ticket_state=1&queue=${this.queue}`,
      )
      const newListFromServer = response.data
      this.ticketsList = newListFromServer
      let thereIsNewTicket = false
      newListFromServer.results.map((item) => {
        if (!this.checkIfTicketListIncludeItem(oldTicketList, item)) {
          item.isNewTicket = true
          thereIsNewTicket = true
          this.newTicketsArray = [...this.newTicketsArray, item]
        }
      })
      this.isLoading = false
    },

    speech(speechArray) {
      return this.playNotification().then(() => {
        return speechArray.reduce((prev, ticket) => {
          return prev.then(() => {
            const text = `Талон ${ticket.ticket_number_verbose} к оператору ${ticket.get_operator_workplace}`
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.lang = "ru-RU"
            utterance.rate = 1.2
            utterance.pitch = 1.0
            const voices = speechSynthesis.getVoices()
            const ruVoice = voices.find((v) => v.lang.startsWith("ru"))
            if (ruVoice) utterance.voice = ruVoice
            return new Promise((resolve) => {
              utterance.onend = resolve
              speechSynthesis.speak(utterance)
            })
          })
        }, Promise.resolve())
      })
    },

    checkIfTicketListIncludeItem(checkingArray, checkingItem) {
      return (
        checkingArray.filter((item) => item.id === checkingItem.id).length > 0
      )
    },
  },
  watch: {
    newTicketsArray: {
      async handler(newValue, oldValue) {
        const tickets = [...this.newTicketsArray]
        this.newTicketsArray.length = 0
        queue.add(() => this.speech(tickets))
      },
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
  font-size: 70px;
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
