<template>
    <Alert :message="alert.message" :background="alert.background" :text="alert.text"></Alert>
    <div class="mt-[-2cm] text-red-600 font-bold">
        <p class="mb-[0.5cm]">Sisa Waktu: {{ formattedTime }}</p>
        <div class="flex justify-center gap-[0.5cm] ml-[10px]">
            <div v-for="(method, index) in payMethod" :key="index">
                <button @click="handleClick(method)">
                    <img :src="method" class="h-[20px] rounded-md border bg-white" />
                </button>
            </div>
            <img :src="image" />
        </div>
        <Payment/>
    </div>
</template>
<script>
import { ref } from 'vue';
import { local } from '../../api'
import axios from 'axios';

import Alert from '../template/Alert.vue'

import Payment from '../payment/Payment.vue'
import { mapActions, mapState } from 'vuex';

export default {
    name: 'StepTwo',
    data() {
        return {
            jenis: '',
            remainingTime: ref(0),
            interval: null,
            payMethod: [
                '/Dana.jpg', '/BCA.png', '/BRI.png'
            ]
        }
    },
    computed: {
        ...mapState(['isPaymentOpen', 'alert']),
        formattedTime() {
            console.log(this.remainingTime)
            const hours = Math.floor(this.remainingTime / 3600)
            const minutes = Math.floor((this.remainingTime % 3600) / 60)
            const seconds = this.remainingTime % 60
            return `${hours}j : ${minutes}m : ${seconds}d`
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        async getData() {
            const id = localStorage.getItem('idUser')
            await axios.get(local + `reservasi-payment/${id}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res)
                    const createdAt = new Date(res.data.data.created_at).getTime()
                    const now = new Date().getTime()
                    const duration = Math.floor((createdAt + 24 * 60 * 60 * 1000 - now) / 1000)
                    if (duration > 0) {
                        this.startCountdown(duration)
                    }else {
                        this.statusCancel()
                    }
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                })
        },
        async statusCancel() {
            const id = localStorage.getItem('idUser')
            await axios.put(local + `update-status/${id}`, {
                from_status: 'PEMBAYARAN',
                to_status: 'CANCEL'
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
                    // window.location.reload()
                })
                .then(async (error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                })
        },  
        startCountdown(duration) {
            this.remainingTime = duration
            this.interval = setInterval(() => {
                if (this.remainingTime > 0) {
                    this.remainingTime--
                } else {
                    clearInterval(this.interval)
                    this.statusCancel()
                }
            }, 1000)
            
        },
        // handleClick(tipe) {
        //     if (tipe === '/Dana.jpg')
        //         this.jenis = 'DANA'
        //     else if (tipe === '/BCA.png')
        //         this.jenis = 'BCA'
        //     else if (tipe === '/BRI.png')
        //         this.jenis = 'BRI'
        //     this.payment()
        // },
        // close() {
        //     this.jenis = null
        //     this.closePayment()
        // }
    },
    components: {
        Payment,
        Alert
    }
}
</script>