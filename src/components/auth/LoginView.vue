<template>
  <navigation-layout></navigation-layout>
  <div
    class="d-flex justify-content-center align-items-center container-fluid"
    style="height: calc(100vh - 57.8px)"
  >
    <div v-if="isLoading">
      <div class="spinner-grow" style="width: 3rem; height: 3rem" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <main class="form-signin w-100 m-auto" v-else>
      <form @submit="submitHandler">
        <div class="text-start">
          <img
            class="mb-4"
            src="../../assets/logo.png"
            alt=""
            width="72"
            height="72"
          />
        </div>

        <h1 class="h3 mb-3 fw-normal">Авторизуйтесь</h1>

        <div class="form-floating">
          <input
            type="text"
            class="form-control bg-body rounded-bottom-0"
            id="id_login"
            placeholder="login"
            v-model="auth_data.username"
          />
          <label for="id_login">Логин</label>
        </div>
        <div class="form-floating">
          <input
            type="password"
            class="form-control bg-body"
            id="id_password"
            v-model="auth_data.password"
            placeholder="Password"
          />
          <label for="id_password">Пароль</label>
        </div>

        <button class="btn btn-primary w-100 py-2" type="submit">Войти</button>
        <p class="mt-5 mb-3 text-body-secondary">&copy; Designed by OOIT</p>
      </form>
    </main>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"
export default {
  name: "LoginView",
  components: { NavigationLayout },
  data() {
    return {
      isLoading: false,
      auth_data: {
        username: "levenko",
        password: "1986",
      },
    }
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    submitHandler(e) {
      e.preventDefault()
      e.stopPropagation()
      this.isLoading = true
      this.$store
        .dispatch("auth/actionLogIn", { ...this.auth_data })
        .then(() => {
          this.$router.replace(this.$route.query.redirect || "/")
        })
        .finally(() => (this.isLoading = false))
    },
  },
}
</script>

<style scoped>
html,
body {
  height: 100% !important;
}

.form-signin {
  max-width: 330px;
  padding: 1rem;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}

.b-example-divider {
  width: 100%;
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow:
    inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.b-example-vr {
  flex-shrink: 0;
  width: 1.5rem;
  height: 100vh;
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.nav-scroller {
  position: relative;
  z-index: 2;
  height: 2.75rem;
  overflow-y: hidden;
}

.nav-scroller .nav {
  display: flex;
  flex-wrap: nowrap;
  padding-bottom: 1rem;
  margin-top: -1px;
  overflow-x: auto;
  text-align: center;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.btn-bd-primary {
  --bd-violet-bg: #712cf9;
  --bd-violet-rgb: 112.520718, 44.062154, 249.437846;

  --bs-btn-font-weight: 600;
  --bs-btn-color: var(--bs-white);
  --bs-btn-bg: var(--bd-violet-bg);
  --bs-btn-border-color: var(--bd-violet-bg);
  --bs-btn-hover-color: var(--bs-white);
  --bs-btn-hover-bg: #6528e0;
  --bs-btn-hover-border-color: #6528e0;
  --bs-btn-focus-shadow-rgb: var(--bd-violet-rgb);
  --bs-btn-active-color: var(--bs-btn-hover-color);
  --bs-btn-active-bg: #5a23c8;
  --bs-btn-active-border-color: #5a23c8;
}

.bd-mode-toggle {
  z-index: 1500;
}

.bd-mode-toggle .dropdown-menu .active .bi {
  display: block !important;
}
</style>
