import { createStore } from "vuex"

import auth from "@/store/modules/auth"
import errors from "@/store/modules/errors.js"

const store = createStore({
  modules: {
    auth,
    errors,
  },
})

export default store
