<template>
  <nav
    class="navbar navbar-expand-lg bg-body-secondary-phoenix"
    style="position: sticky; top: 0; z-index: 100000; height: 58px"
  >
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img src="../../assets/logo.png" alt="KIS" width="30" height="30" />
      </a>
      <slot name="menu"></slot>
      <ul
        class="navbar-nav ms-auto me-4 mb-2 mb-lg-0"
        v-if="!userData.hasOwnProperty('is_preloaded_data')"
      >
        <li class="nav-item dropstart">
          <a
            class="nav-link"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              v-if="userData.avatar"
              :src="userData.avatar"
              class="rounded-circle"
              alt="..."
              style="width: 40px"
            />
            <img
              v-else
              src="../../assets/without_photo.jpg"
              class="rounded-circle"
              alt="..."
              style="width: 40px; height: 40px"
            />
          </a>

          <div
            class="dropdown-menu my-4 bg-body-secondary-phoenix"
            style="width: 230px"
          >
            <div class="d-flex justify-content-center align-items-center">
              <img
                v-if="userData.avatar"
                :src="userData.avatar"
                class="rounded-circle"
                alt="..."
                style="width: 60px; height: 60px"
              />
              <img
                v-else
                src="../../assets/without_photo.jpg"
                class="rounded-circle"
                alt="..."
                style="width: 60px; height: 60px"
              />
            </div>
            <div class="text-center">
              <p class="my-2 fw-bold">{{ userData.get_display_name }}</p>
            </div>
            <div class="border-bottom border-1"></div>
            <div class="d-flex justify-content-center align-items-center p-3">
              <button
                class="btn btn-secondary-phoenix text-center border-0"
                @click="logOut"
              >
                <span class="text-nowrap"
                  ><font-awesome-icon
                    :icon="['fas', 'arrow-right-from-bracket']"
                  />
                  Выход из системы</span
                >
              </button>
            </div>
          </div>
        </li>
      </ul>

      <div class="theme-control-toggle fa-icon-wait px-2">
        <input
          class="form-check-input ms-0 theme-control-toggle-input"
          type="checkbox"
          data-theme-control="phoenixTheme"
          value="dark"
          id="themeControlToggle"
          @change="modeChange"
          :checked="currentTheme === 'dark'"
        />
        <label
          class="mb-0 theme-control-toggle-label theme-control-toggle-light"
          for="themeControlToggle"
          data-bs-toggle="tooltip"
          data-bs-placement="left"
          data-bs-title="Switch theme"
          style="height: 32px; width: 32px"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16px"
            height="16px"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-moon icon"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </label>
        <label
          class="mb-0 theme-control-toggle-label theme-control-toggle-dark"
          for="themeControlToggle"
          data-bs-toggle="tooltip"
          data-bs-placement="left"
          data-bs-title="Switch theme"
          style="height: 32px; width: 32px"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16px"
            height="16px"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-sun icon"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </label>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "base-list-layout",
  components: {},
  data() {
    return {
      htmlElement: null,
      currentTheme: null,
    }
  },
  async created() {
    this.htmlElement = document.documentElement
    this.currentTheme = localStorage.getItem("bsTheme") || "dark"
    this.htmlElement.setAttribute("data-bs-theme", this.currentTheme)
  },
  methods: {
    modeChange(e) {
      const checked = e.target.checked
      if (checked) {
        this.htmlElement.setAttribute("data-bs-theme", "dark")
        localStorage.setItem("bsTheme", "dark")
      } else {
        this.htmlElement.setAttribute("data-bs-theme", "light")
        localStorage.setItem("bsTheme", "light")
      }
    },
    logOut() {
      this.$store.dispatch("auth/actionRemoveLogIn")
      this.$router.push({ name: "login", replace: true })
    },
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
    }),
  },
}
</script>

<style scoped>
thead {
  position: sticky;
  top: 0;
}

.theme-control-toggle .theme-control-toggle-label {
  height: 2rem;
  width: 2rem;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  background-color: var(--phoenix-theme-control-toggle-bg);
  color: var(--phoenix-theme-control-toggle-color);
  border-radius: 50%;
  cursor: pointer;
  -webkit-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.theme-control-toggle .theme-control-toggle-label:hover {
  background-color: var(--phoenix-theme-control-toggle-hover-bg);
  color: var(--phoenix-theme-control-toggle-hover-color);
}

.theme-control-toggle.theme-control-toggle-slim .theme-control-toggle-label {
  padding: 0 0.5rem;
  height: 1rem;
  width: auto;
  border-radius: 50rem;
}

.theme-control-toggle.theme-control-toggle-slim
  .theme-control-toggle-label
  .icon {
  height: 10.2px;
  width: 10.2px;
}

.theme-control-toggle .theme-control-toggle-input {
  display: none;
}

.theme-control-toggle
  .theme-control-toggle-input:checked
  ~ .theme-control-toggle-dark {
  display: none;
}

.theme-control-toggle
  .theme-control-toggle-input:not(:checked)
  ~ .theme-control-toggle-light {
  display: none;
}
</style>
