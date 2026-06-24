<template>
  <div>
    <div
      class="amia-header p-3 d-flex flex-row justify-content-center align-items-center"
    >
      <audio
        ref="audioPlayer"
        :src="audioSrc"
        controls
        style="display: none"
      ></audio>
      <div class="me-auto">
        <h1>Электронная очередь</h1>
      </div>
      <div>
        <div class="d-flex flex-column">
          <h3>Текущее время</h3>
          <h2 class="fw-bold">
            {{
              new Date(currentTime).toLocaleString("ru-RU", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })
            }}
          </h2>
        </div>
      </div>
    </div>
    <div>
      <QueueComponent :queue="queueId" :play-notification="playNotification" />
    </div>
  </div>
</template>

<script>
import QueueComponent from "@/components/electronic_queue/QueueMonitoringView/QueueComponent.vue"

export default {
  name: "QueueMonitoringView",
  components: { QueueComponent },
  data() {
    return {
      currentTime: new Date(),
      queueId: null,
      audioSrc: "/notify.mp3",
    }
  },
  async created() {
    this.queueId = this.$route.params.queue
    setInterval(() => {
      this.currentTime = new Date()
    }, 1000)
  },
  mounted() {
    this.audioPlayer = this.$refs.audioPlayer
  },
  methods: {
    playNotification() {
      this.audioPlayer.play()
    },
  },
}
</script>

<style scoped>
.amia-header {
  color: white;
  background-image: linear-gradient(94deg, #213852, #085273);
}
</style>
