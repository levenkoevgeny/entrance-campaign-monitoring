<script>
import { monitoringAPI } from "@/api/monitoring/monitoringAPI.js"

export default {
  name: "Monitoring",
  data() {
    return {
      myJson: "",
      institute_url: ["dfo", "imvd", "dfo_Moskva", "fp", "fpk"],
      url: [],
      previewJson: {
        education_form: "",
        institute: "",
        faculty_name: "",
        specialty_name: "",
      },
      isFP: false,
      range: [],
      date: "",
      time: "",
      intervalMonitoring: null,
    }
  },
  methods: {
    async getJson(flag = false) {
      const response = await monitoringAPI.getJSON()
      this.myJson = response.data.data
      this.date = this.myJson.date
      this.time = this.myJson.time
      this.range = this.myJson.range
      if (flag) {
        this.createUrlArray()
      }
    },
    createUrlArray() {
      for (let i = 0; i < this.institute_url.length; i++) {
        const faculties =
          this.myJson[this.institute_url[i]].body.educational_institution
            .faculties
        for (let j = 0; j < faculties.length; j++) {
          const faculty = faculties[j]
          for (let k = 0; k < faculty.specialties.length; k++) {
            this.url.push({
              faculty: this.institute_url[i],
              query: { faculty: j, specialty: k },
            })
          }
        }
      }
      this.createPreview()
    },
    interval() {
      let counter = 0
      let index = 0
      this.intervalMonitoring = setInterval(() => {
        if (counter % this.url.length === 0) {
          this.getJson()
        }
        index = counter % this.url.length
        this.createPreview(index)
        counter += 1
      }, 1000)
    },
    createPreview(index = 0) {
      const parse = this.myJson[this.url[index].faculty]
      this.isFP = this.url[index].faculty === "fp"
      this.previewJson.institute =
        parse.body.educational_institution.educational_institution_title
      if (this.isFP) {
        this.previewJson.education_form =
          parse.body.educational_institution.faculties[
            this.url[index].query.faculty
          ].faculty_name
      } else {
        this.previewJson.education_form = parse.head.education_form
      }
      this.previewJson.faculty_name =
        parse.body.educational_institution.faculties[
          this.url[index].query.faculty
        ].faculty_name
      this.previewJson.specialty_name = this.createSpecialName(
        parse.body.educational_institution.faculties[
          this.url[index].query.faculty
        ].specialties[this.url[index].query.specialty].specialty_name,
      )
      this.previewJson.plans = {
        ...parse.body.educational_institution.faculties[
          this.url[index].query.faculty
        ].specialties[this.url[index].query.specialty].specialty_data,
      }
    },
    createSpecialName(text) {
      const index = text.indexOf("(")
      if (index > -1) {
        return {
          name: text.slice(0, index - 1),
          interests: text.slice(index + 1, text.length - 1),
        }
      } else {
        return { name: text, interests: "" }
      }
    },
  },
  mounted() {
    this.interval()
  },
  unmounted() {
    clearInterval(this.intervalMonitoring)
  },
  created() {
    this.getJson(true)
  },
  computed: {
    lengthCount() {
      if (this.isFP) {
        return this.range.length + 5
      } else {
        return this.range.length + 6
      }
    },
  },
}
</script>

<template>
  <div class="d-flex flex-column">
    <div class="w-100 text-center py-2 myBg">
      <h3>Информация о ходе приема документов в {{ previewJson.institute }}</h3>
    </div>
    <div class="mx-3">
      <div class="pt-3">
        <h1 class="tdHead myColorRed-700 text-center">
          <strong v-if="!isFP">{{ previewJson.faculty_name }}</strong>
          <strong v-else>Факультет права</strong>
        </h1>
      </div>
      <div class="text-center">
        <h2 style="font-size: 2.6rem">
          специальность «<strong class="myColorRed-700 tdHead">{{
            previewJson.specialty_name.name
          }}</strong
          >»
        </h2>
        <h2>{{ previewJson.specialty_name.interests }}</h2>
      </div>
      <div class="w-100 py-3 text-end">
        <h4>
          <span
            >Форма получения образования -
            <strong>{{ previewJson.education_form }}</strong></span
          >
        </h4>
      </div>
      <div class="py-3 d-flex justify-content-between">
        <div v-if="!isFP" class="myColorRed">
          <h2><strong>План приема:</strong></h2>
          <h2 v-for="(person, key) in previewJson.plans">
            <span>
              {{ key }} -
              <strong>{{ person["План приема"] }}</strong>
            </span>
          </h2>
        </div>
        <div v-else class="myColorRed">
          <h2>
            <strong>План приема - </strong>
            <strong v-for="person in previewJson.plans">
              {{ person["План приема"] }}</strong
            >
          </h2>
        </div>

        <table class="table table-bordered text-center" style="width: 20%">
          <thead class="myBgTable">
            <tr>
              <td><strong style="font-size: 25px">Дата</strong></td>
              <td><strong style="font-size: 25px">Время</strong></td>
            </tr>
          </thead>
          <tbody>
            <tr style="vertical-align: middle">
              <td>
                <strong style="font-size: 25px">{{ date }}</strong>
              </td>
              <td>
                <strong style="font-size: 40px">{{ time }}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <table
          class="table-bordered text-center w-100"
          :class="[isFP ? 'myStrippedTdFp' : 'myStrippedTd']"
        >
          <thead>
            <tr>
              <td class="p-1" :colspan="lengthCount">
                <h4>Подано заявлений от абитуриентов</h4>
              </td>
            </tr>

            <tr>
              <td v-if="!isFP" rowspan="2" class="vertical-text py-2">
                <h5>Категория абитуриентов</h5>
              </td>
              <td rowspan="2" class="vertical-text py-2">
                <h4>План приема</h4>
              </td>
              <td rowspan="2" class="vertical-text py-2">
                <h4>Подано заявлений</h4>
              </td>
              <td class="py-2" colspan="3">
                <strong>в том числе</strong>
              </td>
              <td class="py-2" :colspan="range.length">
                <h4>с суммой набранных баллов для конкурсного зачисления</h4>
              </td>
            </tr>
            <tr>
              <td class="vertical-text py-2"><h5>Без экзаменов</h5></td>
              <td class="vertical-text py-2"><h5>Вне конкурса</h5></td>
              <td class="tdHead vertical-text py-2"><h5>По конкурсу</h5></td>
              <td
                class="p-0 py-5 vertical-text"
                v-for="point in range"
                :key="point"
              >
                <h4>{{ point }}</h4>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cat, key) in previewJson.plans">
              <td v-if="!isFP">
                <strong>{{ key }}</strong>
              </td>
              <td style="vertical-align: middle" class="fw-bold py-5">
                <h4>{{ cat["План приема"] }}</h4>
              </td>
              <td style="vertical-align: middle">
                <h5>{{ cat["Всего"] }}</h5>
              </td>
              <td style="vertical-align: middle">
                <h5>{{ cat["Без экзаменов"] }}</h5>
              </td>
              <td style="vertical-align: middle">
                <h5>{{ cat["Вне конкурса"] }}</h5>
              </td>
              <td style="vertical-align: middle">
                <h5>{{ cat["По конкурсу"] }}</h5>
              </td>
              <td style="vertical-align: middle" v-for="point in range">
                <h4>{{ cat["scores"][point] }}</h4>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1,
h2,
h3,
h4,
h5,
h6 {
  margin-bottom: 0;
}
.myBg {
  background-color: #a3cfbb;
}
.myColorRed-700 {
  color: #842029;
}
.myColorRed {
  color: #dc3545;
}

.myBgTable {
  --bs-table-color: #f1f1f1;
  --bs-table-bg: #4e6128;
}
.tdHead {
  text-transform: uppercase;
}

.vertical-text {
  transform: rotate(-180deg);
  writing-mode: vertical-rl;
}

.myStrippedTd,
.myStrippedTdFp {
  background-color: rgba(162, 205, 186, 0.2);
}

.myStrippedTd > thead tr:first-child,
.myStrippedTdFp > thead tr:first-child {
  background-color: #76923c;
  color: #f1f1f1;
}

.myStrippedTd > thead tr:nth-child(2) > td:nth-child(2n + 2),
.myStrippedTd > thead tr:nth-child(3) > td:nth-child(2n + 1),
.myStrippedTd > tbody td:nth-child(2n + 2) {
  background-color: var(--bs-success-border-subtle) !important;
}
.myStrippedTdFp > thead tr:nth-child(2) > td:nth-child(2n + 1),
.myStrippedTdFp > thead tr:nth-child(3) > td:nth-child(2n + 1),
.myStrippedTdFp > tbody td:nth-child(2n + 1) {
  background-color: var(--bs-success-border-subtle) !important;
}
* {
  margin: 0;
  padding: 0;
}
</style>
