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
      <div class="my-5">
        <button
          class="btn btn-primary"
          v-for="queue in queueList.results"
          :key="queue.id"
          @click="
            $router.push({ name: 'queue-processing', params: { id: queue.id } })
          "
        >
          {{ queue.queue_name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import getQueueAPIInstance from "@/api/electronic_queue/queueAPI.js"
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"

export default {
  name: "AdminQueueListView",
  components: { NavigationLayout },
  data() {
    return {
      queueList: { count: 0, results: [], previous: null, next: null },
      isLoading: true,
      isError: false,
      queueAPIInstance: getQueueAPIInstance(),
      freeTicket: null,
      interval: null,
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.isLoading = true
        const response = await this.queueAPIInstance.getItemsList()
        this.queueList = await response.data
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style scoped></style>
