<template>
  <!--  <div-->
  <!--    style="height: 100vh"-->
  <!--    class="d-flex justify-content-center align-items-center"-->
  <!--  >-->
  <!--    <div class="spinner-grow" style="width: 5rem; height: 5rem" role="status">-->
  <!--      <span class="visually-hidden">Loading...</span>-->
  <!--    </div>-->
  <!--  </div>-->
  <div>
    <div
      class="amia-header p-3 d-flex flex-row justify-content-center align-items-center"
    >
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
    <div class="container">
      <QueueComponent />
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
    }
  },
  async created() {
    setInterval(() => {
      this.currentTime = new Date()
    }, 1000)
  },
  methods: {},
}
</script>

<style scoped>
.amia-header {
  color: white;
  background-image: linear-gradient(94deg, #213852, #085273);
}
</style>
