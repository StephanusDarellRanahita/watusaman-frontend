<template>
    <div class="flex mx-auto w-fit gap-[0.5cm] mt-[-1.5cm]">
        <form v-if="userRes == null" class="p-[0.5cm] flex flex-col gap-[2px] border-2 rounded-xl border-red-600 mb-[0.5cm]"
            @submit.prevent="submitReservasi">
            <div class="font-bold text-left mb-[0.5cm]">
                <p>Tanggal</p>
                <a-range-picker v-model:value="tanggal" @change="changeDate" :disabledDate="disabledDate" />
            </div>
            <div class="text-left mb-[0.5cm]">
                <p class="font-bold mb-[0.2cm]">Jumlah Orang</p>
                <p>Dewasa</p>
                <div class="flex gap-[0.2cm]">
                    <a-input-number v-model:value="input.dewasa" :min="1" :max="maxDewasa" class="w-[2cm]" :controls="false"
                        required></a-input-number>
                    <a-button @click="updateJumlah('inc', 'dewasa')"><svg-icon type="mdi" :path="path.mdiPlus"
                            class="w-[0.5cm]" /></a-button>
                    <a-button @click="updateJumlah('dec', 'dewasa')"><svg-icon type="mdi" :path="path.mdiMinus"
                            class="w-[0.5cm]" /></a-button>
                </div>
                <p>Anak-anak</p>
                <div class="flex gap-[0.2cm]">
                    <a-input-number v-model:value="input.anak" :min="0" :max="maxAnak" class="w-[2cm]" :controls="false"
                        required></a-input-number>
                    <a-button @click="updateJumlah('inc', 'anak')"><svg-icon type="mdi" :path="path.mdiPlus"
                            class="w-[0.5cm]" /></a-button>
                    <a-button @click="updateJumlah('dec', 'anak')"><svg-icon type="mdi" :path="path.mdiMinus"
                            class="w-[0.5cm]" /></a-button>
                    <p>Umur : 5 - 17 Tahun</p>
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
            <div class="font-bold text-left">
                <p>Total Harga</p>
                <a-input v-model:value="updateHarga" :disabled="true"></a-input>
            </div>
            <div>
                <button type="submit" class="mt-[0.2cm] rounded-xl p-[0.2cm]"
                    :class="check ? ['bg-transparent', 'text-gray-400', 'border-2', 'cursor-not-allowed'] : ['bg-red-600', 'text-white', 'hover:ring-[2px]', 'hover:ring-red-600', 'hover:bg-red-200', 'hover:text-red-600']"
                    :disabled="check">Reservasi</button>
            </div>
        </form>
        <form v-else-if="userRes" class="p-[0.5cm] flex flex-col gap-[2px] border-2 rounded-xl border-red-600 mb-[0.5cm]"
            @submit.prevent="updateReservasi">
            <div class="font-bold text-left mb-[0.5cm]">
                <p>Tanggal</p>
                <p class="text-gray-300 bg-gray-100 border ont-mono rounded-xl p-[0.2cm]">{{ formatDate(userRes.start_date)
                }} - {{ formatDate(userRes.end_date) }} </p>
            </div>
            <div class="text-left mb-[0.5cm]">
                <p class="font-bold mb-[0.2cm]">Jumlah Orang</p>
                <p>Dewasa</p>
                <div class="flex gap-[0.2cm]">
                    <a-input-number v-model:value="userRes.dewasa" :min="1" :max="maxDewasa" class="w-[2cm]"
                        :controls="false" required></a-input-number>
                    <a-button @click="updateJumlah('inc', 'dewasa')"><svg-icon type="mdi" :path="path.mdiPlus"
                            class="w-[0.5cm]" /></a-button>
                    <a-button @click="updateJumlah('dec', 'dewasa')"><svg-icon type="mdi" :path="path.mdiMinus"
                            class="w-[0.5cm]" /></a-button>
                </div>
                <p>Anak-anak</p>
                <div class="flex gap-[0.2cm]">
                    <a-input-number v-model:value="userRes.anak" :min="1" :max="maxAnak" class="w-[2cm]" :controls="false"
                        required></a-input-number>
                    <a-button @click="updateJumlah('inc', 'anak')"><svg-icon type="mdi" :path="path.mdiPlus"
                            class="w-[0.5cm]" /></a-button>
                    <a-button @click="updateJumlah('dec', 'anak')"><svg-icon type="mdi" :path="path.mdiMinus"
                            class="w-[0.5cm]" /></a-button>
                </div>
            </div>
            <div class="font-bold text-left">
                <p>Nomor Telepon</p>
                <a-input v-model:value="userRes.nomor_telepon" placeholder="08...." required></a-input>
            </div>
            <div class="font-bold text-left">
                <p>Nama</p>
                <a-input v-model:value="userRes.nama" placeholder="Nama" required></a-input>
            </div>
            <div class="font-bold text-left">
                <p>Total Harga</p>
                <a-input v-model:value="updateHargaRecord" placeholder="Nama" :disabled="true"></a-input>
            </div>
            <div>
                <button type="submit"
                    class="mt-[0.2cm] rounded-xl p-[0.2cm] hover:bg-red-200 border border-red-600 text-red-600">Update</button>
            </div>
        </form>
        <div v-if="condition">
            <div :class="check ? 'max-h-[13.4cm]' : 'h-fit'" class="p-[0.3cm] border-2 border-red-600 overflow-auto rounded-md">
                <p :class="check ? 'text-red-600' : 'text-green-400'" class="transition-all duration-500 ease-in-out">{{
                    checkMessage }}</p>
                <div v-if="check">
                    <p>-----------------</p>
                    <div class="flex flex-col py-[0.2cm] gap-[0.3cm]">
                        <button v-for="(date, index) in check" :key="index"
                            class="border w-[3.5cm] lg:w-fit p-[0.2cm]  rounded-xl bg-yellow-200">
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

import { message } from 'ant-design-vue'

export default {
    name: 'StepOne',
    data() {
        return {
            tanggal: ref(),
            check: [],
            checkMessage: {},
            userRes: {},
            jumlahHari: 0,
            jumlahHariRecord: 0,
            input: {
                startDate: null,
                endDate: null,
                dewasa: 0,
                anak: 0,
                noTelp: '',
                nama: '',
                harga: 0,
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
            } else {
                this.input.startDate = null
                this.input.endDate = null
            }
        },
    },
    computed: {
        ...mapState(['isInputResValid', 'alert']),
        changeDate() {
            if (this.input.startDate && this.input.endDate) {
                this.checkDate()
                this.hari()
            }
        },
        maxDewasa() {
            return 30 - this.input.anak
        },
        maxAnak() {
            return 30 - this.input.dewasa
        },
        updateHarga() {
            const jumlah = this.input.dewasa + this.input.anak
            let harga = 1250000 * this.jumlahHari
            if (jumlah > 10) {
                harga = harga + (jumlah - 10) * 100000
                return this.input.harga = harga
            }

            return this.input.harga = harga
        },
        updateHargaRecord() {
            const jumlah = this.userRes.dewasa + this.userRes.anak
            let harga = 1250000 * this.jumlahHariRecord
            if (jumlah > 10) {
                harga = harga + (jumlah - 10) * 100000
                return this.userRes.total_harga = harga
            }
            return this.userRes.total_harga = harga
        }
    },
    mounted() {
        this.recordRes()
    },
    methods: {
        ...mapActions(['reservasi', 'showAlert', 'hideAlert']),
        async submitReservasi() {
            const loadingMessage = message.loading('Verifying', 0)
            await axios.post(local + `reservasi/${localStorage.getItem('idUser')}`, {
                start_date: this.input.startDate,
                end_date: this.input.endDate,
                dewasa: this.input.dewasa,
                anak: this.input.anak,
                nomor_telepon: this.input.noTelp,
                nama: this.input.nama,
                total_harga: this.input.harga
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(async (res) => {
                    loadingMessage()
                    console.log(res)
                    this.reservasi()
                    localStorage.setItem('idReservasi', res.data.data.reservasi.id)
                    console.log('res', localStorage.getItem('idReservasi'))
                    this.sendWhatsApp()
                    this.recTanggal = { ...this.tanggal }
                    this.recordRes()
                    this.input.anak = 0
                    this.input.dewasa = 0
                    this.input.endDate = ''
                    this.input.nama = ''
                    this.input.noTelp = ''
                    this.input.startDate = ''
                    message.success(res.data.message, 2)
                    setTimeout(() => {
                        window.location.reload()
                    },1000)
                })
                .catch(async (error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data.message)
                    if (error.response.data.message.nomor_telepon) {
                        message.error(error.response.data.message.nomor_telepon[0], 2)
                    } else {
                        console.log('DEWASA')
                        loadingMessage()
                        this.showAlert({ message: error.response.data.message, background: 'bg-red-500', text: 'text-white' })
                        message.error(error.response.data.message, 2)
                    }

                })
        },
        async updateReservasi() {
            const id = localStorage.getItem('idUser')
            const date = this.userRes.start_date
            const loadingMessage = message.loading('Updating', 0)
            await axios.put(local + `reservasi/${id}/${date}`, {
                dewasa: this.userRes.dewasa,
                anak: this.userRes.anak,
                nomor_telepon: this.userRes.nomor_telepon,
                nama: this.userRes.nama,
                total_harga: this.userRes.total_harga
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(async (res) => {
                    loadingMessage()
                    console.log(res)
                    console.log(res.data.message)
                    this.showAlert({ message: res.data.message, background: 'bg-green-300', text: 'text-black' })
                    message.success(res.data.message, 2)
                })
                .catch(async (error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    message.error(error.response.data.message)
                })
        },
        async recordRes() {
            const id = localStorage.getItem('idUser')
            await axios.get(local + `reservasi-payment/${id}`, {
                headers: {
                    Accept: 'applicaton/json'
                }
            })
                .then(res => {
                    console.log(res)
                    this.userRes = res.data.data
                    this.hari()
                    console.log('USER RES', this.userRes)
                    console.log('JUMLAH HARI', this.jumlahHariRecord)
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data.message)
                    this.userRes = null
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
        hari() {
            if (this.input.startDate && this.input.endDate) {
                this.jumlahHari = moment(this.input.endDate).diff(moment(this.input.startDate), 'days')
                return this.jumlahHari
            } else if (this.userRes.start_date && this.userRes.end_date) {
                this.jumlahHariRecord = moment(this.userRes.end_date).diff(moment(this.userRes.start_date), 'days')
                return this.jumlahHariRecord
            }

            return 0

        },
        updateJumlah(formula, type) {
            if (this.userRes == null) {
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
            } else if (this.userRes != null) {
                if (type == 'dewasa') {
                    if (formula == 'inc' && this.userRes.dewasa < 30 && (this.userRes.dewasa + this.userRes.anak) !== 30) {
                        this.userRes.dewasa++
                    } else if (formula == 'dec' && this.userRes.dewasa > 0) {
                        this.userRes.dewasa--
                    }
                } else {
                    if (formula == 'inc' && this.userRes.anak < 30 && (this.userRes.dewasa + this.userRes.anak) !== 30) {
                        this.userRes.anak++
                    } else if (formula == 'dec' && this.userRes.anak > 0) {
                        this.userRes.anak--
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