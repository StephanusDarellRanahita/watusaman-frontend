<template>
    <Navbar></Navbar>
    <div class="flex flex-col gap-[5cm]">
        <Alert :visible="alert.visible" :message="alert.message" :background="alert.background" :text="alert.text"></Alert>
        <div class="flex flex-wrap justify-between text-center text-orange-500 px-[1cm] py-[2cm] h-full">
            <div class="absolute bg-repeat opacity-[5%] inset-0 -z-10" style="background-image: url('/Cloud.png');"></div>
            <div>
                <p class="font-bold text-[30px]">Welcome to Villa Watusaman</p>
                <p>Watusaman Homestay, Gallery & Resto Bakmijawa</p>
                <p>Ringroad Selatan Jl. Parangtritis km 4.5 Dusun Saman 1. No 98. Rt 11. Sewon Bantul</p>
                <p>Daerah Istimewa Yogyakarta</p>
                <div>
                    <button @click="scrollToReservasi"
                        class="mt-[2cm] bg-yellow-200 p-[0.4cm] text-orange-500 font-bold text-[20px] hover:text-[25px] rounded-xl hover:p-[0.25cm] transition-all hover:ease-in ease-out duration-500">Reservasi</button>
                </div>
                <p class="mt-[3cm] text-[20px]">Welcome, <h class="italic font-semibold">{{ user.name }}</h>
                </p>
            </div>
            <div>
                <p class="font-bold text-[25px] mb-[0.5cm]">KAMAR</p>
                <div class="flex overflow-x-auto gap-[0.4cm] snap-x snap-mandatory">
                    <div class="w-[6cm] border-2 border-yellow-300 rounded-xl flex flex-col items-center font-thin pb-[0.5cm] snap-center snap-always"
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
        <div id="reservasi-section" class="border">
            <div class="p-[1cm] w-[25cm] mx-auto">
                <a-steps :current="current" :items="items"></a-steps>
                <div class="steps-content">
                    <component :is="steps[current].component"/>
                </div>
                <div class="steps-action mt-[0.5cm]">
                    <a-button v-if="current < steps.length - 1" type="primary" @click="next">Next</a-button>
                    <a-button v-if="current == steps.length - 1" type="primary"
                        @click="message.success('Processing complete!')">
                        Done
                    </a-button>
                    <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">Previous</a-button>
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
            current: ref(0),
            steps: [
                { title: 'Isi Data', content: 'First Content', component: StepOne },
                { title: 'Pilih Pembayaran', content: 'Second Content', component: StepTwo },
                { title: 'Invoice', content: 'Third Content' }
            ],
            items: []
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
        this.getData()
        this.getUser()
        this.items = this.steps.map(item => ({
            key: item.title,
            title: item.title
        }))
        console.log('Id Dashboard: ', localStorage.getItem('idUser'))
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
                    this.image = res.data.data.data
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
                    console.log('User Res: ', this.userRes.length)
                    this.checkStatusRes()
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data.message)
                })
        },
        scrollToReservasi() {
            const reservasiSection = document.getElementById('reservasi-section');
            if (reservasiSection) {
                reservasiSection.scrollIntoView({ behavior: 'smooth' })
            }
        },
        checkStatusRes() {
            let i
            console.log('User Res Check: ', this.userRes)
            for(i=0;i<this.userRes.length;i++) {
                if(this.userRes[i].status === 'PEMBAYARAN') {
                    this.current = 1
                    break
                }
                console.log(i)
            }
        }, //Step Ant Design Vue
        async next() {
            if(this.isInputResValid){
                this.current++
                this.reservasi()
            }else {
                this.showAlert({ message: 'Mohon Untuk Lengkapi Data Reservasi Terlebih Dahulu!', background: "bg-red-500", text: 'text-white' })
                new Promise((resolve) => {
                    setTimeout(() => {
                        this.hideAlert()
                        resolve
                    }, 2000)
                })
            }
        },
        prev() {
            this.reservasi()
            this.current--
        }
    },
    components: {
        Navbar,
        SvgIcon,
        Alert,
        StepOne
    }
}
</script>

<style scoped>
.steps-content {
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    padding-top: 80px;
}
</style>