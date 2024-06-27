<style scoped>
.transition-hover {
    height: 2.5cm;
    transition: height 0.5s ease;
    overflow: hidden;
    /* Ensure overflow is hidden */
}

.transition-hover:hover {
    height: 7cm;
    /* Change height on hover */
}
</style>
<template>
    <Navbar class="print:hidden"></Navbar>
    <div class="flex flex-col gap-[5cm]">
        <div class="flex flex-wrap justify-between text-center text-black px-[1cm] py-[3cm] h-full print:hidden">
            <div>
                <p class="font-bold text-[30px]">Welcome to Villa Watusaman</p>
                <p>Watusaman Homestay, Gallery & Resto Bakmijawa</p>
                <p>Ringroad Selatan Jl. Parangtritis km 4.5 Dusun Saman 1. No 98. Rt 11. Sewon Bantul</p>
                <p>Daerah Istimewa Yogyakarta</p>
                <div>
                    <button @click="scrollToReservasi"
                        class="mt-[2cm] border-2 border-red-600 p-[0.4cm] text-red-600 font-bold text-[20px] hover:text-[25px] hover:bg-red-200 rounded-xl hover:p-[0.25cm] transition-all hover:ease-in ease-out duration-200 ">Reservasi</button>
                </div>
                <p class="mt-[1cm] text-[20px]">Welcome, <h class="italic font-semibold">{{ user.name }}</h>
                </p>
                <div class="mt-[1cm] flex flex-col gap-[0.5cm]">
                    <div v-if="loading" 
                        class="border w-[9cm] mx-auto rounded-md p-[0.3cm] h-[2.5cm] animate-pulse">
                        <div class="border h-[10px] rounded-md bg-gray-100"></div>
                        <div class="border h-[10px] w-[4cm] mx-auto rounded-md bg-gray-100 mt-[0.3cm]"></div>
                    </div>
                    <div v-if="loading" 
                        class="border w-[9cm] mx-auto rounded-md p-[0.3cm] h-[2.5cm] animate-pulse">
                        <div class="border h-[10px] rounded-md bg-gray-100"></div>
                        <div class="border h-[10px] w-[4cm] mx-auto rounded-md bg-gray-100 mt-[0.3cm]"></div>
                    </div>
                    <div v-else-if="!loading" class="flex flex-col gap-[0.5cm]">
                        <div v-for="(data, index) in reservasis" :key="index"
                            class="flex flex-col w-[9cm] mx-auto border-2 gap-[0.1cm] p-[0.3cm] rounded-md border-red-600 transition-hover">
                            <p>{{ data.nama }} [ {{ formattedDate(data.start_date) }} - {{ formattedDate(data.end_date)
                            }} ]
                            </p>
                            <p v-if="data.sisa_pembayaran == 0 && data.status == 'SELESAI'"
                                class="mb-[0.3cm] font-bold text-green-500">Status [ LUNAS ]</p>
                            <p v-else-if="data.sisa_pembayaran != 0 && data.status == 'SELESAI'"
                                class="mb-[0.3cm] font-bold text-yellow-400">Status [ DP ]</p>
                            <p v-else
                                :class="data.status == 'PEMBAYARAN' ? ['text-red-600', 'font-bold'] : ['text-green-500', 'font-bold']"
                                class="mb-[0.3cm] font-bold text-green-500">Status [ {{ data.status }} ]</p>
                            <p>-------------------------------------</p>
                            <div class="text-left">
                                <p class="text-center">{{ data.nomor_telepon }}</p>
                                <p>Dewasa <a class="ml-[1cm]">:</a> {{ data.dewasa }}</p>
                                <p>Anak <a class="ml-[1.5cm]">:</a> {{ data.anak }}</p>
                                <p>Total <a class="ml-[1.54cm]">:</a> Rp {{ formattedNumber(data.total_harga) }}</p>
                                <p>Kekurangan <a class="ml-[0.21cm]">:</a> Rp {{ formattedNumber(data.sisa_pembayaran)
                                }}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div>
                <p class="font-bold text-[25px] mb-[0.5cm]">KAMAR</p>
                <div v-if="loading" class="flex overflow-x-auto gap-[0.4cm] snap-x snap-mandatory animate-pulse">
                    <div  class="flex flex-col w-[6cm]">
                        <div class="w-[6cm] border-2 rounded-xl items-center pb-[0.5cm] py-[0.1cm] ">
                            <a-skeleton-image />
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                        </div>
                    </div>
                    <div  class="flex flex-col w-[6cm]">
                        <div class="w-[6cm] border-2 rounded-xl items-center pb-[0.5cm] py-[0.1cm] ">
                            <a-skeleton-image />
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                        </div>
                    </div>
                    <div  class="flex flex-col w-[6cm]">
                        <div class="w-[6cm] border-2 rounded-xl items-center pb-[0.5cm] py-[0.1cm] ">
                            <a-skeleton-image />
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                        </div>
                    </div>
                </div>
                <div v-if="!loading" class="flex overflow-x-auto gap-[0.4cm] snap-x snap-mandatory">
                    <div class="w-[6cm] border-2 border-red-600 rounded-xl flex flex-col items-center font-thin pb-[0.5cm] snap-center snap-always"
                        v-for="(data, index) in image" :key="index">
                        <img :src="data.image" class="h-[4cm] p-[0.1cm] rounded-t-xl" />
                        <p class="grid grid-cols-2 w-[3cm]"><svg-icon type="mdi" :path="path.mdiDoor"
                                class="h-[0.5cm] my-auto" />
                        <p class="text-left">{{ data.nomor_kamar }}</p>
                        </p>
                        <p class="grid grid-cols-2 w-[3cm]"><svg-icon type="mdi" :path="path.mdiAccountMinus"
                                class="h-[0.5cm] my-auto" />
                        <p class="text-left">{{ data.min_pax }} Pax</p>
                        </p>
                        <p class="grid grid-cols-2 w-[3cm]"><svg-icon type="mdi" :path="path.mdiAccountMultiplePlus"
                                class="h-[0.5cm] my-auto" />
                        <p class="text-left">{{ data.max_pax }} Pax</p>
                        </p>
                        <p class="grid grid-cols-2 w-[3cm]"><svg-icon type="mdi" :path="path.mdiBedEmpty"
                                class="h-[0.5cm] my-auto" />
                        <p class="font-bold text-left uppercase">{{ data.tipe }}</p>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div id="reservasi-section" class="border print:mt-[5cm]">
            <div class="p-[1cm] w-[25cm] mx-auto">
                <a-steps :current="current" :items="items"></a-steps>
                <div class="steps-content">
                    <component :is="steps[current].component"/>
                </div>
                <div class="steps-action mt-[0.5cm] print:hidden">
                    <button v-if="current < steps.length - 1 && current != 1" @click="next" class="border border-red-600 p-[5px] rounded-md text-red-600 hover:bg-red-200">Next</button>
                    <button v-if="current == steps.length - 1" type="primary" @click="statusSelesai" class="border border-red-600 p-[5px] rounded-md text-red-600 hover:bg-red-200">
                        Cetak
                    </button>
                    <button v-if="current > 0 && current != 2" style="margin-left: 8px" @click="prev" class="border border-red-600 p-[5px] rounded-md text-red-600 hover:bg-red-200">Previous</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { local } from '../api';
import { ref } from 'vue';

//import mdi icon
import SvgIcon from '@jamescoyle/vue-icon'
import {
    mdiAccountMinus, mdiDoor,
    mdiAccountMultiplePlus, mdiBedEmpty
} from '@mdi/js'

import { mapState, mapActions } from 'vuex'

import axios from 'axios';
import Navbar from './template/Navbar.vue'
import Alert from './template/Alert.vue'
import StepOne from './steps/StepOne.vue'
import StepTwo from './steps/StepTwo.vue'
import StepThree from './steps/StepThree.vue'
import moment from 'moment';
import { message } from 'ant-design-vue';

export default {
    data() {
        return {
            path: {
                mdiAccountMinus, mdiDoor, mdiAccountMultiplePlus,
                mdiBedEmpty
            },
            image: [],
            user: {},
            userRes: [],
            reservasis: [],
            current: ref(0),
            steps: [
                { title: 'Isi Data', content: 'First Content', component: StepOne },
                { title: 'Pilih Pembayaran', content: 'Second Content', component: StepTwo },
                { title: 'Invoice', content: 'Third Content', component: StepThree }
            ],
            items: [],
            loading: ref(true)
        }
    },
    computed: {
        ...mapState(['isInputResValid', 'alert']),
        sortImage() {
            this.checkStatusRes()
            return this.image.slice().sort((a, b) => a.id - b.id)
        },
    },
    mounted() {
        this.loading = true
        this.getData()
        this.getUser()
        this.getReservasi()
        this.items = this.steps.map(item => ({
            key: item.title,
            title: item.title
        }))
    },
    methods: {
        ...mapActions(['reservasi', 'showAlert', 'hideAlert']),
        async getData() {
            await axios.get(local + 'kamars', {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res)
                    this.image = res.data.data.data.sort((a, b) => a.nomor_kamar - b.nomor_kamar)
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                })
        },
        async getReservasi() {
            const id = localStorage.getItem('idUser')
            await axios.get(local + `reservasi/${id}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log('reservasi: ', res)
                    this.reservasis = res.data.data
                    this.loading = false
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                })
        },
        async getUser() {
            const id = localStorage.getItem('idUser')
            await axios.get(local + 'users/' + id, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res)
                    this.user = res.data.data
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                })

            await axios.get(local + `reservasi/${id}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res)
                    this.userRes = res.data.data
                    this.checkStatusRes()
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data.message)
                })
        },
        async statusSelesai() {
            const id = localStorage.getItem('idUser')
            await axios.put(local + `update-status/${id}`, {
                from_status: 'INVOICE',
                to_status: 'SELESAI'
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(async (res) => {
                    console.log(res)
                    this.showAlert({ message: res.data.message, background: 'bg-green-300', text: 'text-white' })
                    await new Promise((resolve) => {
                        setTimeout(() => {
                            this.hideAlert()
                            resolve()
                        }, 2000)
                    })
                    window.print()
                    window.location.reload()
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                })
        },
        scrollToReservasi() {
            const reservasiSection = document.getElementById('reservasi-section');
            if (reservasiSection) {
                reservasiSection.scrollIntoView({ behavior: 'smooth' })
            }
        },
        formattedNumber(number) {
            if (typeof number !== 'number') {
                return '0';
            }
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        formattedDate(time) {
            return moment(time).format('DD MMM YYYY')
        },
        checkStatusRes() {
            let i
            for (i = 0; i < this.userRes.length; i++) {
                if (this.userRes[i].status === 'PEMBAYARAN') {
                    this.current = 1
                    break
                } else if (this.userRes[i].status === 'INVOICE') {
                    this.current = 2
                } else {
                    this.current = 0
                }
            }
        }, //Step Ant Design Vue
        async next() {
            if (this.isInputResValid) {
                this.current++
                this.reservasi()
            } else {
                message.error('Mohon Lengkapi Data Reservasi Terlebih Dahulu!',2)
            }
        },
        prev() {
            if (this.current != 2) {
                this.reservasi()
                this.current--
            }
        }
    },
    components: {
        Navbar,
        SvgIcon,
        Alert,
    }
}
</script>

<style scoped>
.steps-content {
    margin-top: 16px;
    border: 5px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    padding-top: 80px;
}
</style>