<template>
    <div class="flex mx-auto text-orange-400 w-fit gap-[0.5cm]">
        <form v-if="!userRes.length"
            class="p-[0.5cm] flex flex-col gap-[2px] border-2 rounded-xl border-yellow-300 mb-[0.5cm]"
            @submit.prevent="submitReservasi">
            <div class="font-bold text-left mb-[0.5cm]">
                <p>Tanggal</p>
                <a-range-picker v-model:value="tanggal" @change="changeDate" :disabledDate="disabledDate" />
            </div>
            <div class="text-left mb-[0.5cm]">
                <p class="font-bold mb-[0.2cm]">Jumlah Orang</p>
                <p>Dewasa</p>
                <div class="flex gap-[0.2cm]">
                    <a-input-number v-model:value="input.dewasa" :max="maxDewasa" class="w-[2cm]" required></a-input-number>
                    <a-button @click="updateJumlah('inc', 'dewasa')"><svg-icon type="mdi" :path="path.mdiPlus"
                            class="w-[0.5cm]" /></a-button>
                    <a-button @click="updateJumlah('dec', 'dewasa')"><svg-icon type="mdi" :path="path.mdiMinus"
                            class="w-[0.5cm]" /></a-button>
                </div>
                <p>Anak-anak</p>
                <div class="flex gap-[0.2cm]">
                    <a-input-number v-model:value="input.anak" :max="maxAnak" class="w-[2cm]" required></a-input-number>
                    <a-button @click="updateJumlah('inc', 'anak')"><svg-icon type="mdi" :path="path.mdiPlus"
                            class="w-[0.5cm]" /></a-button>
                    <a-button @click="updateJumlah('dec', 'anak')"><svg-icon type="mdi" :path="path.mdiMinus"
                            class="w-[0.5cm]" /></a-button>
                </div>
            </div>
            <div class="font-bold text-left">
                <p>Nomor Telepon</p>
                <a-input v-model:value="input.noTelp" placeholder="08...." required></a-input>
            </div>
            <div class="font-bold text-left">
                <p>Nama</p>
                <a-input v-model:value="input.nama" placeholder="Nama" required></a-input>
            </div>
            <div>
                <button type="submit" class="mt-[0.2cm] rounded-xl p-[0.2cm]"
                    :class="check ? ['bg-transparent', 'text-gray-400', 'border-2', 'cursor-not-allowed'] : ['bg-blue-600', 'text-white']"
                    :disabled="check">Reservasi</button>
            </div>
        </form>
        <form v-else-if="userRes" class="p-[0.5cm] flex flex-col gap-[2px] border-2 rounded-xl border-yellow-300 mb-[0.5cm]"
            @submit.prevent="updateReservasi">
            <div class="font-bold text-left mb-[0.5cm]">
                <p>Tanggal</p>
                <p class="text-gray-300 bg-gray-100 border ont-mono rounded-xl p-[0.2cm]">{{ formatDate(record.start_date)
                }} - {{ formatDate(record.end_date) }} </p>
            </div>
            <div class="text-left mb-[0.5cm]">
                <p class="font-bold mb-[0.2cm]">Jumlah Orang</p>
                <p>Dewasa</p>
                <div class="flex gap-[0.2cm]">
                    <a-input-number v-model:value="record.dewasa" :min="1" :max="maxDewasa" class="w-[2cm]"
                        required></a-input-number>
                    <a-button @click="updateJumlah('inc', 'dewasa')"><svg-icon type="mdi" :path="path.mdiPlus"
                            class="w-[0.5cm]" /></a-button>
                    <a-button @click="updateJumlah('dec', 'dewasa')"><svg-icon type="mdi" :path="path.mdiMinus"
                            class="w-[0.5cm]" /></a-button>
                </div>
                <p>Anak-anak</p>
                <div class="flex gap-[0.2cm]">
                    <a-input-number v-model:value="record.anak" :min="1" :max="maxAnak" class="w-[2cm]" required></a-input-number>
                    <a-button @click="updateJumlah('inc', 'anak')"><svg-icon type="mdi" :path="path.mdiPlus"
                            class="w-[0.5cm]" /></a-button>
                    <a-button @click="updateJumlah('dec', 'anak')"><svg-icon type="mdi" :path="path.mdiMinus"
                            class="w-[0.5cm]" /></a-button>
                </div>
            </div>
            <div class="font-bold text-left">
                <p>Nomor Telepon</p>
                <a-input v-model:value="record.nomor_telepon" placeholder="08...." required></a-input>
            </div>
            <div class="font-bold text-left">
                <p>Nama</p>
                <a-input v-model:value="record.nama" placeholder="Nama" required></a-input>
            </div>
            <div>
                <button type="submit" class="mt-[0.2cm] rounded-xl p-[0.2cm] bg-blue-600 text-white">Update</button>
            </div>
        </form>
        <div v-if="condition" class="mt-[1.1cm]">
            <div :class="check ? 'h-[3cm]' : 'h-fit'" class="p-[0.3cm] border-2 border-yellow-300 overflow-auto rounded-md">
                <p :class="check ? 'text-red-600' : 'text-green-400'" class="transition-all duration-500 ease-in-out">{{
                    checkMessage }}</p>
                <div v-if="check">
                    <p>-----------------</p>
                    <div class="flex flex-col gap-[0.3cm]">
                        <button v-for="(date, index) in check" :key="index"
                            class="border w-fit p-[0.1cm] rounded-xl bg-yellow-200">
                            {{ formatDate(date.start_date) }} - {{ formatDate(date.end_date) }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { local } from '../../api'
import { ref } from 'vue'

import SvgIcon from '@jamescoyle/vue-icon'
import { mdiPlus, mdiMinus } from '@mdi/js'

import axios from 'axios'
import moment from 'moment'
import { mapActions, mapState } from 'vuex'

export default {
    name: 'StepOne',
    data() {
        return {
            tanggal: ref(),
            check: [],
            checkMessage: {},
            record: {},
            userRes: [],
            input: {
                startDate: null,
                endDate: null,
                dewasa: 0,
                anak: 0,
                noTelp: '',
                nama: ''
            },
            condition: false,
            today: new Date(),
            path: {
                mdiPlus, mdiMinus
            }
        }
    },
    watch: {
        tanggal(newDates) {
            if (newDates && newDates.length === 2) {
                this.input.startDate = newDates[0].format('YYYY-MM-DD')
                this.input.endDate = newDates[1].format('YYYY-MM-DD')
                console.log('Start Date:', this.input.startDate)
                console.log('End Date:', this.input.endDate)
            } else {
                this.input.startDate = null
                this.input.endDate = null
            }
        }
    },
    computed: {
        ...mapState(['isInputResValid', 'alert']),
        changeDate() {
            if (this.input.startDate && this.input.endDate) {
                this.checkDate()
            }
        },
        maxDewasa() {
            return 30 - this.input.anak
        },
        maxAnak() {
            return 30 - this.input.dewasa
        }
    },
    mounted() {
        this.recordRes()
        console.log('Rec Tanggal: ', this.recTanggal)
    },
    methods: {
        ...mapActions(['reservasi', 'showAlert', 'hideAlert']),
        async submitReservasi() {
            await axios.post(local + `reservasi/${localStorage.getItem('idUser')}`, {
                start_date: this.input.startDate,
                end_date: this.input.endDate,
                dewasa: this.input.dewasa,
                anak: this.input.anak,
                nomor_telepon: this.input.noTelp,
                nama: this.input.nama
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res)
                    this.reservasi()
                    this.showAlert({ message: res.data.message, background: 'bg-green-300', text: 'text-black' })
                    this.sendWhatsApp()
                    this.recTanggal = { ...this.tanggal }
                    console.log('Sesudah Submit : ', this.tanggal)
                    this.recordRes()
                    new Promise((resolve) => {
                        setTimeout(() => {
                            this.hideAlert()
                            resolve
                        }, 2000)
                    })
                    this.input.anak = 0
                    this.input.dewasa = 0
                    this.input.endDate = ''
                    this.input.nama = ''
                    this.input.noTelp = ''
                    this.input.startDate = ''
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data.message)
                    if (error.response.data.message.nomor_telepon) {
                        console.log('Nomor Telepon')
                        this.showAlert({ message: error.response.data.message.nomor_telepon[0], background: 'bg-red-500', text: 'text-white' })
                        new Promise((resolve) => {
                            setTimeout(() => {
                                this.hideAlert()
                                resolve
                            }, 2000)
                        })
                    } else {
                        console.log('DEWASA')
                        this.showAlert({ message: error.response.data.message, background: 'bg-red-500', text: 'text-white' })
                        new Promise((resolve) => {
                            setTimeout(() => {
                                this.hideAlert()
                                resolve
                            }, 2000)
                        })
                    }

                })
        },
        async updateReservasi() {
            const id = localStorage.getItem('idUser')
            const date = this.record.start_date
            await axios.put(local + `reservasi/${id}/${date}`, {
                dewasa: this.record.dewasa,
                anak: this.record.anak,
                nomor_telepon: this.record.nomor_telepon,
                nama: this.record.nama
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res)
                    console.log(res.data.message)
                    this.showAlert({ message: res.data.message, background: 'bg-green-300', text: 'text-black' })
                    new Promise((resolve) => {
                        setTimeout(() => {
                            this.hideAlert()
                            resolve
                        }, 2000)
                    })
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                    this.showAlert({ message: error.response.data.message, background: 'bg-red-500', text:'text-white' })
                    new Promise((resolve) => {
                        setTimeout(() => {
                            this.hideAlert()
                            resolve
                        }, 2000)
                    })
                })
        },
        async recordRes() {
            const id = localStorage.getItem('idUser')
            await axios.get(local + `reservasi/${id}`, {
                headers: {
                    Accept: 'applicaton/json'
                }
            })
                .then(res => {
                    console.log(res)
                    this.userRes = res.data.data
                    console.log('User Res: ', this.userRes)
                    if (this.userRes.length) {
                        let i
                        for (i = 0; i < this.userRes.length; i++) {
                            this.record = { ...this.userRes[i] }
                        }
                    }
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data.message)
                })
        },
        async checkDate() {
            await axios.post(local + 'check-date', {
                start_date: this.input.startDate,
                end_date: this.input.endDate
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res)
                    this.checkMessage = res.data.message
                    this.check = res.data.data
                    this.condition = true
                    console.log('check: ' + this.check)
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                })
        },
        async sendWhatsApp() {
            await axios.post(local + 'send-whatsapp', {
                start_date: this.input.startDate,
                end_date: this.input.endDate,
                nama: this.input.nama,
                nomor_telepon: this.input.noTelp,
                dewasa: this.input.dewasa,
                anak: this.input.anak
            })
        },
        statusRes() {
            let i
            console.log('User Res Check: ', this.userRes)
            for (i = 0; i < this.userRes.length; i++) {
                if (this.userRes[i].status === 'MENUNGGU_KONFIRMASI') {
                    this.record = this.userRes[i]
                    break
                }
                console.log('Record: ', this.record)
            }
        },
        updateJumlah(formula, type) {
            if(!this.userRes) {
                if (type == 'dewasa') {
                    if (formula == 'inc' && this.input.dewasa < 30 && (this.input.dewasa + this.input.anak) !== 30) {
                        this.input.dewasa++
                    } else if (formula == 'dec' && this.input.dewasa > 0) {
                        this.input.dewasa--
                    }
                } else {
                    if (formula == 'inc' && this.input.anak < 30 && (this.input.dewasa + this.input.anak) !== 30) {
                        this.input.anak++
                    } else if (formula == 'dec' && this.input.anak > 0) {
                        this.input.anak--
                    }
                }
            } else if(this.userRes) {
                if (type == 'dewasa') {
                    if (formula == 'inc' && this.record.dewasa < 30 && (this.record.dewasa + this.record.anak) !== 30) {
                        this.record.dewasa++
                    } else if (formula == 'dec' && this.record.dewasa > 0) {
                        this.record.dewasa--
                    }
                } else {
                    if (formula == 'inc' && this.record.anak < 30 && (this.record.dewasa + this.record.anak) !== 30) {
                        this.record.anak++
                    } else if (formula == 'dec' && this.record.anak > 0) {
                        this.record.anak--
                    }
                }
            }
        },
        decrement() {
            if (this.input.dewasa > 0) {
                this.input.dewasa--
            }
        },
        formatDate(time) {
            return moment(time).format('DD MMM YYYY')
        },
        disabledDate(current) {
            return current && current <= this.today
        }
    },
    components: {
        SvgIcon
    }
}
</script>