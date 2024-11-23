<template>
    <div class=" text-black px-[20px] rounded-md mb-[0.1cm]">
        <p class="mb-[0.5cm] text-start">1. Masukkan Nomor Dana Anda</p>
        <a-form @finish="submitTelepon" :model="form" autocomplete="on" class="text-center">
            <a-form-item name="nomor" :rules="[{ required: true, message: 'Silahkan Input Nomor Telepon Dana Anda!' }]">
                <p class="text-[14px]">Nomor Telpon</p>
                <a-input v-model:value="form.nomor" placeholder="nomor" class="w-[8cm]"></a-input>
            </a-form-item>
            <button type="submit"
                class="border-2 p-[5px] text-red-600 rounded-md border-red-600 mb-[0.5cm] hover:bg-red-200 transition-colors duration-500">submit</button>
        </a-form>
        <p class="text-start">2. Masukkan Nominal Pembayaran</p>
        <p class="text-start">3. Masukkan PIN Dana Anda</p>
    </div>
    <a-modal v-model:open="isOpen" title="Dana Payment" @ok="payment">
        <div class="border p-[0.5cm]">
            <a-form class="flex flex-col font-semibold gap-[0.2cm]">
                <div class="border-b-2">
                    <p>3011 0100 3470 509</p>
                    <p class="text-[10px]">DIONYSIUS OKTAVIANTO</p>
                </div>
                <div>
                    <p class="text-[10px] mb-[0.2cm]">JUMLAH KIRIM</p>
                    <a-input-number v-model:value="dp" placeholder="Rp0" :bordered="false" required :min="min"
                        :max="reservasi.total_harga" class="w-full" :controls="false"></a-input-number>
                </div>
                <p class="mx-auto mt-[1cm]">PIN</p>
                <PinInput @update:pin="handlePinUpdate" class="mx-auto"></PinInput>
            </a-form>
        </div>
    </a-modal>
</template>
<script>
import { local } from '../../api';
import { mapActions, mapState } from 'vuex';
import { ref } from 'vue';

import axios from 'axios';
import PinInput from '../template/Pin.vue'
import Alert from '../template/Alert.vue'
import { message } from 'ant-design-vue';


export default {
    name: 'DanaPayment',
    data() {
        return {
            form: {
                nomor: ''
            },
            user: {},
            reservasi: {},
            dp: 0,
            min: 0,
            pin: '',
            isOpen: ref(false),
        }
    },
    computed: {
        ...mapState(['alert', 'isPaymentOpen'])
    },
    mounted() {
        this.getReservasi()
    },
    methods: {
        ...mapActions(['showAlert', 'hideAlert']),
        async submitTelepon() {
            const loadingMessage = message.loading('Verifikasi...', 0)
            await axios.get(local + `user-dana?nomor_telepon=${this.form.nomor}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(async (res) => {
                    loadingMessage()
                    console.log(res)
                    this.user = res.data.data
                    this.isOpen = true
                    message.success(res.data.message, 2)
                })
                .catch(async (error) => {
                    loadingMessage()
                    console.error(error.response),
                        console.error(error.response.data)
                    this.user = null
                    message.error(error.response.data.message)
                })
        },
        async getReservasi() {
            const id = localStorage.getItem('idUser')
            await axios.get(local + `reservasi-payment/${id}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res)
                    this.reservasi = res.data.data
                    this.dp = this.reservasi.total_harga / 2
                    this.min = this.dp
                    console.log('RESERVASI', this.reservasi)
                })
        },
        async payment() {
            const loadingMessage = message.loading('Memverifikasi...', 0)
            await axios.post(local + 'payment', {
                id_user: localStorage.getItem('idUser'),
                id_reservasi: this.reservasi.id,
                total_bayar: this.dp,
                tipe: 'DANA',
                nomor_telepon: this.form.nomor,
                pin: this.pin
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(async (res) => {
                    loadingMessage()
                    console.log(res)
                    this.isOpen = false
                    this.sendWhatsApp()
                    message.success(res.data.message, 2)
                    setTimeout(()=> {
                        window.location.reload()  
                    },2000)
                })
                .catch(async (error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    this.showAlert({ message: error.response.data.message, background: 'bg-red-500', text: 'text-white' })
                    this.isOpen = false
                    message.error(error.response.data.message, 2)
                })

        },
        async sendWhatsApp() {
            console.log(this.reservasi.nama)
            await axios.post(local + 'send-whatsapp', {
                start_date: this.reservasi.start_date,
                end_date: this.reservasi.end_date,
                nama: this.reservasi.nama,
                nomor_telepon: this.reservasi.nomor_telepon,
                dewasa: this.reservasi.dewasa,
                anak: this.reservasi.anak,
                pesan: 'Melakukan Pembayaran Dengan Dana'
            })
        },
        handlePinUpdate(pin) {
            this.pin = pin
        },
        formattedNumber(number) {
            if (typeof number !== 'number') {
                return '0';
            }
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        close() {
            this.isOpen = false
        }
    },
    components: {
        Alert,
        PinInput
    }
}
</script>