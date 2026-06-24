<script>
import { monitoringAPI as API } from "@/api/monitoring/monitoringAPI.js"

export default {
  name: "Monitoring",
  components: {},
  data() {
        return {
            myJson: '',
            //institute_url: ['dfo', 'imvd', 'dfo_Moskva', 'fp', 'fpk'],
			institute_url: ['dfo', 'imvd', 'dfo_Moskva', 'fp'],
            url: [],
            previewJson: {education_form: '', institute: '', faculty_name: '', specialty_name: ''},
            isFP: false,
            isFpAndFpk: false,
            range: [],
            date: '',
            time: '',
            qr: {flag: false, name: ''},
            myInterval: null,
            socialAll: [
                {name: 'Telegram-канал «Академия МВД.BY»', img: '/telegram.png', qr: '/telegramQr.png'},
                {name: 'Youtube-канал \n«Академия МВД Республики Беларусь»', img: '/Youtube.png', qr: '/YoutubeQr.png'},
                {name: 'TikTok @amia_by', img: '/TikTok.png', qr: '/TikTokQr.png'},
                {name: 'Instagram @amia_by', img: '/Inst.png', qr: '/InstQr.png'},

                {name: 'Vkontakte «Академия МВД Республики Беларусь»', img: '/Vk.png', qr: '/VkQr.png'},
            ],
        }
    },
    methods: {
        async getJson(flag = false) {
            const response = await API.getJSON()
            this.myJson = response.data.data

            this.date = new Date(this.myJson.date_time).toLocaleDateString('ru-RU')
            this.time = new Date(this.myJson.date_time).toLocaleTimeString('ru-RU',{hour:'numeric',minute:'numeric'})
            this.range = this.myJson.range
            if (flag) {
                this.createUrlArray()
            }
        },
        createUrlArray() {
            for (let i = 0; i < this.institute_url.length; i++) {
                const faculties = this.myJson[this.institute_url[i]].body.educational_institution.faculties
                for (let j = 0; j < faculties.length; j++) {
                    const faculty = faculties[j]
                    for (let k = 0; k < faculty.specialties.length; k++) {
                        this.url.push({faculty: this.institute_url[i], query: {faculty: j, specialty: k}})
                    }
                }
            }

            this.url.splice(0, 0, {faculty: 'QR', query: 'Telegram'})
            this.url.splice(Math.ceil(this.url.length / 2), 0, {faculty: 'QR', query: 'All'})
            this.createPreview(0)
        },
        interval() {
            let counter = 0
            let index = 0
            this.myInterval = setInterval(() => {
                 this.qr.flag = false
                if (counter % this.url.length === 0) {
                    this.getJson()
                }

                index = counter % this.url.length
                 this.createPreview(index)
				counter += 1
            }, 20000)
        },
        createPreview(index = 0) {
            if (this.url[index].faculty === 'QR') {
                this.qr.flag = true
                this.qr.name = this.url[index].query
            } else {
                const parse = this.myJson[this.url[index].faculty]
                this.isFP = this.url[index].faculty === 'fp'
                this.isFpAndFpk = this.url[index].faculty === 'fp' || this.url[index].faculty === 'fpk'
                this.previewJson.institute = parse.body.educational_institution.educational_institution_title
                if (this.isFP) {
                    this.previewJson.education_form = parse.body.educational_institution.faculties[this.url[index].query.faculty].faculty_name
                } else {
                    this.previewJson.education_form = parse.head.education_form
                }
                this.previewJson.faculty_name = parse.body.educational_institution.faculties[this.url[index].query.faculty].faculty_name
                this.previewJson.specialty_name = this.createSpecialName(
                      parse.body.educational_institution.faculties[this.url[index].query.faculty].specialties[this.url[index].query.specialty].specialty_name
                )
                this.previewJson.plans = {
                    ...parse.body.educational_institution.faculties[this.url[index].query.faculty].specialties[this.url[index].query.specialty].specialty_data,
                }
            }
        },
        createSpecialName(text) {
            const index = text.indexOf('(')
            if (index > -1) {
                return {name: text.slice(0, index - 1), interests: text.slice(index + 1, text.length - 1)}
            } else {
                return {name: text, interests: ''}
            }
        },
    },
    mounted() {
        this.interval()
    },
    unmounted() {
        clearInterval(this.myInterval)
    },
    created() {
        this.getJson(true)
    },
    computed: {
        isLoadPage() {
            return false
        },
        lengthCount() {
            if (this.isFpAndFpk) {
                return this.range.length + 5
            } else {
                return this.range.length + 6
            }
        },
    },
}
</script>

<template>
    <div v-if="qr.flag">
        <div
              v-if="qr.name === 'Telegram'"
              class="allSocial">
            <div
                  class="d-flex justify-content-center align-items-center gap-5"
                  style="height: 100vh">
                <div class="d-flex justify-content-center flex-column align-items-center">
                    <img
                          style="margin: 0"
                          src="/telegram.png"
                          alt=""/>
                    <span style="color: #00205f; font-size: 3rem; text-align: center">
						<strong>
							Telegram-канал<br/>
							«Академия МВД.BY»
						</strong>
					</span>
                </div>

                <img
                      src="/TelegramQrBig.png"
                      alt=""/>
            </div>
        </div>
        <div
              v-else
              class="allSocial" style="height: 100vh">
            <div class="text-center py-3"><h1 style="font-size: 4.2rem; color:#00205f"><strong>Социальные сети</strong>
            </h1></div>
            <div>
                <div class="d-flex justify-content-evenly mb-3">
                    <div class="w-50">
                        <div class="d-flex flex-column ">
                            <div class="d-flex justify-content-center">
                                <img src="/telegram.png" width="150" alt="">
                                <img src="/telegramQr.png" width="150" alt="">
                            </div>
                            <span class="titleSocial">
                            <strong>
                                Telegram-канал<br/>
                                «Академия МВД.BY»
                            </strong>
                            </span>
                        </div>

                    </div>
                    <div class="w-50">
                        <div class="d-flex flex-column ">
                            <div class="d-flex justify-content-center align-items-center">
                                <img src="/Inst.png" width="150" alt="">
                                <img src="/InstQr.png" width="150" alt="">
                            </div>
                            <span class="titleSocial">
                            <strong>
                                Instagram @amia_by
                            </strong>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-evenly mb-2">
                    <div class="w-50">
                        <div class="d-flex flex-column ">
                            <div class="d-flex justify-content-center">
                                <img src="/TikTok.png" width="150" alt="">
                                <img src="/TikTokQr.png" width="150" alt="">
                            </div>
                            <span class="titleSocial">
                            <strong>
                                TikTok @amia_by

                            </strong>
                            </span>
                        </div>

                    </div>
                    <div class="w-50">
                        <div class="d-flex flex-column ">
                            <div class="d-flex  justify-content-center align-items-center">
                                <img src="/Youtube.png" width="150" alt="">
                                <img src="/YoutubeQr.png" width="150" alt="">
                            </div>
                            <span class="titleSocial">
                            <strong style="white-space: nowrap">
                                Youtube-канал<br/> «Академия МВД Республики Беларусь»
                            </strong>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-evenly ">
                    <div class="w-100">
                        <div class="d-flex flex-column ">
                            <div class="d-flex justify-content-center">
                                <img src="/Vk.png" width="150" alt="" style="margin-right: 40px">
                                <img src="/VkQr.png" width="150" alt="">
                            </div>
                            <span class="titleSocial">
                            <strong>
                                Vkontakte «Академия МВД Республики Беларусь»


                            </strong>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div
          v-if="!qr.flag"
          class="d-flex flex-column">
        <div class="w-100 text-center p-2 myBg">
            <h3>Информация о ходе приема документов в {{ previewJson.institute }}</h3>
        </div>
        <div class="py-1">
            <h1 class="tdHead myColorRed-700 text-center">
                <strong v-if="!isFP">{{ previewJson.faculty_name }}</strong>
                <strong v-else>Факультет права</strong>
            </h1>
        </div>
        <div class="text-center">
            <h2 style="font-size: 2.6rem">
                специальность «<strong class="myColorRed-700 tdHead">{{ previewJson.specialty_name.name }}</strong
            >»
            </h2>
            <h2>{{ previewJson.specialty_name.interests }}</h2>
        </div>
        <div class="px-3">
            <div class="py-3 w-100 text-end">
                <h4>
					<span>
						Форма получения образования - <strong>{{ previewJson.education_form }}</strong>
					</span>
                </h4>
            </div>
            <div class="py-3 d-flex justify-content-between w-100">
                <div
                      v-if="!isFpAndFpk"
                      class="myColorRed">
                    <h2><strong>План приема:</strong></h2>
                    <h2 v-for="(person, key, index) in previewJson.plans">
						<span>
							{{ key }} -
							<strong>{{ person['План приема'] }}</strong>
						</span>
                    </h2>
                </div>
                <div
                      v-else
                      class="myColorRed">
                    <h2>
                        <strong>План приема - </strong>
                        <strong v-for="person in previewJson.plans"> {{ person['План приема'] }}</strong>
                    </h2>
                </div>

                <table
                      class="table table-bordered text-center"
                      style="width: 20%">
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
            <table
                  class="table-bordered text-center w-100" style="width: 100vw;"
                  :class="[isFpAndFpk ? 'myStrippedTdFp' : 'myStrippedTd']">
                <thead>
                <tr>
                    <td
                          class="p-1"
                          :colspan="lengthCount">
                        <h4>Подано заявлений от абитуриентов</h4>
                    </td>
                </tr>

                <tr>
                    <td
                          v-if="!isFpAndFpk"
                          style="width: 5%"
                          rowspan="2"
                          class="vertical-text py-2">
                        <h5>Категория абитуриентов</h5>
                    </td>
                    <td
                          style="width: 3%"
                          rowspan="2"
                          class="vertical-text py-2">
                        <h4>План приема</h4>
                    </td>
                    <td
                          rowspan="2"
                          class="vertical-text py-2">
                        <h4>Подано заявлений</h4>
                    </td>
                    <td
                          class="py-2"
                          colspan="3">
                        <strong>в том числе</strong>
                    </td>
                    <td
                          class="py-2"
                          :colspan="range.length">
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
                          :key="point">
                        <h4>{{ point }}</h4>
                    </td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(cat, key, index) in previewJson.plans">
                    <td v-if="!isFpAndFpk">
                        <span style="font-size: 1.3rem"><strong>{{ key }}</strong></span>
                    </td>
                    <td
                          style="vertical-align: middle"
                          class="fw-bold py-5">
                        <h4>{{ cat['План приема'] }}</h4>
                    </td>
                    <td style="vertical-align: middle">
                        <h5>{{ cat['Всего'] }}</h5>
                    </td>
                    <td style="vertical-align: middle">
                        <h5>{{ cat['Без экзаменов'] }}</h5>
                    </td>
                    <td style="vertical-align: middle">
                        <h5>{{ cat['Вне конкурса'] }}</h5>
                    </td>
                    <td style="vertical-align: middle">
                        <h5>{{ cat['По конкурсу'] }}</h5>
                    </td>
                    <td
                          style="vertical-align: middle"
                          v-for="point in range">
                        <h4>{{ cat['scores'][point] }}</h4>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
* {
    margin: 0;
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

.allSocial {
    background: url('/fon.png');
    background-size: 100% 100vh;
}

.myGrid {
    grid-template-rows:repeat(3, 33.3%);
    grid-auto-flow: column;
    justify-items: center;
    align-items: center;
    padding: 4rem 2rem
}

.titleSocial {
    color: #00205f;
    font-size: 2rem;
    text-align: center;
    margin-top: 10px
}

.justify-content-center > img:first-child{
margin-right: 30px;
}

@media (max-width: 600px) {
    .vertical-text {
        transform: rotate(0deg) !important;
    }
}
</style>
