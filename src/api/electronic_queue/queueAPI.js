import BaseAPI from "@/api/baseAPIClass"

class queueAPI extends BaseAPI {}

export default function getQueueAPIInstance() {
  return new queueAPI(
    "queues",
    {
      queue_name__icontains: "",
      queue_liter__icontains: "",
    },
    {
      queue_name: "",
      queue_liter: "",
    },
  )
}
