import BaseAPI from "@/api/baseAPIClass"

class ticketAPI extends BaseAPI {}

export default function getTicketAPIInstance() {
  return new ticketAPI(
    "tickets",
    {
      ticket_number: "",
      ticket_number_verbose__icontains: "",
      ticket_state: "",
      queue: "",
      operator: "",
    },
    {
      ticket_number: "",
      ticket_number_verbose: "",
      ticket_state: "",
      queue: null,
      operator: null,
    },
  )
}
