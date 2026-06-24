<script>
import HeadTable from "@/components/monitoring-site/HeadTable.vue"
import { monitoringAPI as API } from "@/api/monitoring/monitoringAPI.js"

export default {
  name: "MonitoringSite",
  components: { HeadTable },
  data() {
    return {
      isFP: false,
      url: "",
      myJson: {},
      date: "",
      time: "",
      count: 0,
      points: "",
      myHead: "",
      myBody: "",
    }
  },
  methods: {
    async getJson() {
      const response = await API.getJSON()
      this.myJson = response.data.data
      this.date = new Date(this.myJson.date_time).toLocaleDateString("ru-RU")
      this.time = new Date(this.myJson.date_time).toLocaleTimeString("ru-RU", {
        hour: "numeric",
        minute: "numeric",
      })
      this.points = this.myJson.range
      this.count = this.points.length + 4
      this.url = this.$route.params.facultyId
      this.isFP = this.url === "fp"
      this.myJson = this.myJson[this.url]
      this.myHead = this.myJson.head
      this.myBody = this.myJson.body.educational_institution
    },
    nullOrValue(value) {
      return value ? value : ""
    },
    countPerson(object) {
      return Object.keys(object).length
    },
    isEmpty(text) {
      return text.toLowerCase() === "empty" ? " " : text
    },
  },
  computed: {
    getCountHeadFirst() {
      return this.count
    },
    getCountHeadSecond() {
      return this.count - 4
    },
    isLoadPage() {
      if (!this.myJson) {
        return true
      } else if (!this.myHead) {
        return true
      } else if (!this.myBody) {
        return true
      }
    },
  },
  created() {
    this.getJson()
  },
}
</script>

<template>
  <div class="app" style="background-color: white">
    <div v-if="isLoadPage"></div>
    <div v-else>
      <HeadTable :time="time" :date="date" :head="myHead" :is-fp="isFP" />
      <table class="table-bordered text-center w-100">
        <thead style="cursor: default; vertical-align: middle">
          <tr>
            <td style="width: 8%" rowspan="3">Фаультет, специальность</td>
            <td style="width: 5%" rowspan="3" class="vertical-text">
              Категория абитуриентов
            </td>
            <td style="width: 3%" rowspan="3" class="vertical-text">
              План приема
            </td>
            <td :colspan="getCountHeadFirst" class="tdHead">
              <strong>
                <h6>Подано заявлений от абитуриентов</h6>
              </strong>
            </td>
          </tr>
          <tr>
            <td rowspan="2" class="vertical-text">Всего</td>
            <td colspan="3">в том числе</td>
            <td :colspan="getCountHeadSecond">
              с суммой набранных баллов для конкурсного зачисления
            </td>
          </tr>
          <tr>
            <td class="vertical-text">без экзаменов</td>
            <td class="vertical-text">вне конкурса</td>
            <td class="tdHead vertical-text">по конкурсу</td>
            <td
              class="p-0 py-1 vertical-text"
              v-for="point in points"
              :key="point"
            >
              {{ point }}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <!--Учреждение-->
            <td :colspan="getCountHeadFirst + 3">
              <h3>
                <strong>
                  {{ myBody.educational_institution_title }}
                </strong>
              </h3>
            </td>
          </tr>
          <tr v-if="isFP">
            <td :colspan="getCountHeadFirst + 3">
              <h3>
                <strong class="tdHead"> Факультет права</strong>
              </h3>
            </td>
          </tr>
          <template v-for="facultiy in myBody.faculties">
            <tr>
              <td :colspan="getCountHeadFirst + 3">
                <h4 class="tdHead">
                  <strong v-if="isFP">Форма получения образования </strong
                  ><strong>{{ facultiy.faculty_name }}</strong>
                </h4>
              </td>
            </tr>
            <template v-for="special in facultiy.specialties">
              <tr
                class="trClass"
                v-for="(person, person_key, index) in special.specialty_data"
              >
                <td
                  :rowspan="countPerson(special.specialty_data)"
                  v-if="index === 0"
                >
                  <h4>{{ special.specialty_name }}</h4>
                </td>
                <td style="vertical-align: middle">
                  <strong>{{ isEmpty(person_key) }}</strong>
                </td>
                <td style="vertical-align: middle" class="fw-bold">
                  <h4>{{ person["План приема"] }}</h4>
                </td>
                <td style="vertical-align: middle">
                  <h5>{{ person["Всего"] }}</h5>
                </td>
                <td style="vertical-align: middle">
                  <h5>{{ person["Без экзаменов"] }}</h5>
                </td>
                <td style="vertical-align: middle">
                  <h5>{{ person["Вне конкурса"] }}</h5>
                </td>
                <td style="vertical-align: middle">
                  <h4>{{ person["По конкурсу"] }}</h4>
                </td>
                <td style="vertical-align: middle" v-for="point in points">
                  {{ person["scores"][point] }}
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
    <div
      v-if="url === 'dfo' || url === 'imvd'"
      style="text-align: justify; text-indent: 2rem"
    >
      <p style="font-size: 1.2rem"><strong>Уважаемые абитуриенты!</strong></p>
      <p>
        Обращаем внимание, что
        <strong
          >в графе «Подано заявлений от абитуриентов» приведены данные о
          количестве заявлений только по одному учреждению высшего образования
          МВД (далее УВО МВД), одному факультету и специальности, указанной
          абитуриентом в качестве первой, являющейся приоритетной.</strong
        >
      </p>
      <p>
        При этом в соответствии с пунктом 29 Порядка приема в учреждение
        образования «Академия Министерства внутренних дел Республики Беларусь»
        на 2025 год для получения общего высшего образования и пунктом 27
        Порядка приема в учреждение образования «Могилевский институт
        Министерства внутренних дел Республики Беларусь» на 2025 год для
        получения общего высшего образования, при подаче заявления в
        межвузовскую приемную комиссию абитуриент указывает УВО МВД, факультеты
        и специальности, в конкурсе на которые он будет участвовать.
      </p>
      <p>
        С учетом указанных норм <strong>абитуриент,</strong> претендующий на
        поступление в Академию МВД и (или) Могилевский институт МВД на дневную
        форму получения общего высшего образования за счет средств
        республиканского бюджета,
        <strong
          >участвует в конкурсе во все учреждения высшего образования, на все
          факультеты и специальности, указанные им в заявлении.</strong
        >
      </p>
      <p>
        <strong
          >Учитывая возможность участия каждого абитуриента в конкурсе в оба УВО
          МВД, на разные факультеты и специальности, приведенные сведения могут
          не отражать в полной мере реальной конкурсной ситуации по каждому УВО,
          факультету и специальности.</strong
        >
      </p>
      <p>
        <strong
          >Случаи, при которых показатель «Подано заявлений от абитуриентов» в
          приведенной таблице является более низким по отношению к показателю
          «План приема», не свидетельствуют об отсутствии конкурса по конкретной
          специальности и факультету!</strong
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
h4,
h5 {
  margin: 0;
}
p {
  margin: 0px;
  font-size: 0.9rem;
}
.app {
  margin: 20px 30px;
}

.tdHead {
  text-transform: uppercase;
}

.vertical-text {
  background-color: inherit !important;
  //transform: rotate(-180deg);
  //writing-mode: vertical-rl;
}

table {
  overflow: hidden;
}

.trClass:hover {
  background-color: #ffa;
}

.trClass > td,
th {
  position: relative;
}

.trClass > td:hover::after,
th:hover::after {
  content: "";
  position: absolute;
  background-color: #ffa;
  left: 0;
  top: -5000px;
  height: 10000px;
  width: 100%;
  z-index: -1;
}

td {
  padding: 5px;
}
</style>
