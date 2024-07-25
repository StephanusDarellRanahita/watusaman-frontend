<style scoped>
.transition-hover {
    height: 2.5cm;
    transition: height 0.5s ease;
    overflow: hidden;
    /* Ensure overflow is hidden */
}

.transition-hover:hover {
    height: 8cm;
    /* Change height on hover */
}
</style>
<template>
    <Navbar class="print:hidden"></Navbar>
    <div class="flex flex-col gap-[1cm]">
        <div class="flex flex-wrap justify-between text-center text-black px-[1cm] py-[3cm] h-full print:hidden">
            <div>
                <p class="font-bold text-[30px]">Selamat Datang Di Villa Watusaman</p>
                <p>Villa Watusaman, Gallery & Resto Bakmijawa</p>
                <p>Ringroad Selatan Jl. Parangtritis km 4.5 Dusun Saman 1. No 98. Rt 11. Sewon Bantul</p>
                <p>Daerah Istimewa Yogyakarta</p>
                <div class="flex gap-[0.5cm] justify-center">
                    <button @click="scrollToReservasi"
                        class="mt-[2cm] border-2 border-red-600 p-[0.4cm] text-red-600 font-bold text-[20px] hover:text-[25px] hover:bg-red-200 rounded-xl hover:p-[0.25cm] transition-all hover:ease-in ease-out duration-200 ">Reservasi</button>
                    <button @click="profil"
                        class="mt-[2cm] border-2 border-black p-[0.4cm] font-bold text-[20px] hover:bg-black hover:text-white hover:p-[0.25cm] transition-all ease-in-out duration-200 hover:text-[25px] rounded-xl ">Profil</button>
                </div>
                <p class="mt-[1cm] text-[20px]">Selamat Datang, <h class="italic font-semibold">{{ user.name }}</h>
                </p>
                <div class="mt-[2cm] flex flex-col gap-[0.5cm]">
                    <div v-if="loading" class="border w-[9cm] mx-auto rounded-md p-[0.3cm] h-[2.5cm] animate-pulse">
                        <div class="border h-[10px] rounded-md bg-gray-100"></div>
                        <div class="border h-[10px] w-[4cm] mx-auto rounded-md bg-gray-100 mt-[0.3cm]"></div>
                    </div>
                    <div v-if="loading" class="border w-[9cm] mx-auto rounded-md p-[0.3cm] h-[2.5cm] animate-pulse">
                        <div class="border h-[10px] rounded-md bg-gray-100"></div>
                        <div class="border h-[10px] w-[4cm] mx-auto rounded-md bg-gray-100 mt-[0.3cm]"></div>
                    </div>
                    <div class="grid grid-cols-2 w-fit gap-[0.5cm]">
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
                                :class="data.status == 'PEMBAYARAN' ? ['text-red-600', 'font-bold'] : ['text-red-400', 'font-bold']"
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
                            <div class="mx-auto w-fit mb-[1cm] flex gap-[0.5cm]">
                                <button :class="data.status == 'BATAL' ? ['hidden'] : ['border-red-600', 'hover:bg-red-200']"
                                    class="border-2  rounded-md p-[4px] " @click="cetak(data.id)">Cetak</button>
                                <button
                                    :class="data.status == 'BATAL' ? ['hidden'] : ['border-red-600', 'hover:bg-red-200', 'bg-red-600', 'text-white']"
                                    class="font-boldp-[4px] rounded-md p-[4px]" @click="cancel(data.id)">
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <p class="font-bold text-[25px] mb-[0.5cm]">KAMAR</p>
                <div v-if="loading" class="flex gap-[0.4cm] animate-pulse">
                    <div class="flex flex-col w-[6cm]">
                        <div class="w-[6cm] border-2 rounded-xl items-center pb-[0.5cm] py-[0.1cm] ">
                            <a-skeleton-image />
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                        </div>
                    </div>
                    <div class="flex flex-col w-[6cm]">
                        <div class="w-[6cm] border-2 rounded-xl items-center pb-[0.5cm] py-[0.1cm] ">
                            <a-skeleton-image />
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                        </div>
                    </div>
                    <div class="flex flex-col w-[6cm]">
                        <div class="w-[6cm] border-2 rounded-xl items-center pb-[0.5cm] py-[0.1cm] ">
                            <a-skeleton-image />
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                        </div>
                    </div>
                </div>
                <div v-if="!loading" class="flex overflow-x-scroll gap-[0.4cm] w-[19cm] snap-x snap-mandatory">
                    <div class="min-w-[6cm] border-2 border-red-600 rounded-xl flex flex-col items-center font-thin pb-[0.5cm] snap-center snap-always"
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
                    <div class="min-w-[6cm] border-2 border-red-600 rounded-xl flex flex-col items-center font-thin pb-[0.5cm] snap-center snap-always"
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
                <div class="hidden print:block print:mb-[1cm] w-fit mx-auto">
                    <p
                        class="my-auto font-bold text-black text-center flex text-[35px] flex-row underline decoration-red-600">
                    <p>Villa</p>
                    <p class="text-red-600">W</p>atusaman</p>
                </div>
                <a-steps :current="current" :items="items" class="print:hidden"></a-steps>
                <a-steps :current="2" :items="items" class="text-center print:block" hidden></a-steps>
                <div class="steps-content print:hidden">
                    <component :is="steps[current].component" />
                </div>
                <div class="hidden print:block w-[10cm] mx-auto mb-[1cm] mt-[1cm]">
                    <div class="mx-auto border border-black p-[0.5cm]">
                        <p class="text-center">FAKTUR RESERVASI VILLA WATUSAMAN</p>
                        <p class="text-center">{{ formattedDate(invoice.start_date) }} - {{ formattedDate(invoice.end_date)
                        }}</p>
                    </div>
                    <div class="text-left border border-black text-[13px] flex">
                        <div class="w-full p-[0.1cm]">
                            <p>Nama: {{ invoice.nama }}</p>
                            <p>Nomor: {{ invoice.nomor_telepon }}</p>
                            ----------------------------------
                            <p>Data </p>
                            <p>Dewasa: {{ invoice.dewasa }} | Anak-Anak: {{ invoice.anak }}</p>
                            <p>Total: Rp {{ formattedNumber(invoice.total_harga) }}</p>
                        </div>
                        <div class="w-full border-l border-black p-[0.1cm]">
                            <p>Pembayaran: {{ formattedDate(invoice.updated_at) }}</p>
                            <p>Kekurangan: Rp {{ formattedNumber(invoice.sisa_pembayaran) }}</p>
                            <div class="mx-auto text-center w-fit mt-[0.6cm]">
                                <p v-if="invoice.sisa_pembayaran == 0" class="font-bold text-green-500 text-[20px]">Status [
                                    LUNAS ]</p>
                                <p v-else-if="invoice.sisa_pembayaran != 0" class="font-bold text-green-500 text-[20px]">
                                    Status [ DP ]
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="border p-[0.4cm] border-black">
                        <p class="text-[12px]">*Silahkan Cetak Untuk Ditunjukan Ke Pihak Villa Waktu CheckIn</p>
                    </div>
                </div>
                <div class="steps-action mt-[0.5cm] print:hidden">
                    <button v-if="current < steps.length - 1 && current != 1" @click="next"
                        class="border border-red-600 p-[5px] rounded-md text-red-600 hover:bg-red-200">Next</button>
                    <button v-if="current == steps.length - 1" type="primary" @click="statusSelesai"
                        class="border border-red-600 p-[5px] rounded-md text-red-600 hover:bg-red-200">
                        Cetak
                    </button>
                    <button v-if="current > 0 && current != 2" style="margin-left: 8px" @click="prev"
                        class="border border-red-600 p-[5px] rounded-md text-red-600 hover:bg-red-200">Previous</button>
                </div>
            </div>
        </div>
    </div>
    <Footer class="print:hidden">
    </Footer>
    <a-modal v-model:open="isReset" title="Ubah Pasword" class="text-center" :footer="null">
        <a-form :model="formReset" autocomplete="off" @finish="updatePassword">
            <a-form-item name="oldPassword"
                :rules="[{ required: true, message: 'Password Tidak Boleh Kosong' }, { min: 3, message: 'Password Minimal 3 Digit!' }]">
                <a-input-password v-model:value="formReset.oldPassword" placeholder="Old Password"></a-input-password>
            </a-form-item>
            <a-form-item name="newPassword"
                :rules="[{ required: true, message: 'Password Tidak Boleh Kosong' }, { min: 3, message: 'Password Minimal 3 Digit!' }]">
                <a-input-password v-model:value="formReset.newPassword" placeholder="New Password"
                    class="mt-[0.5cm]"></a-input-password>
            </a-form-item>
            <button type="submit"
                class="border-2 border-red-600 rounded-md p-[4px] text-red-600 mt-[5px] hover:bg-red-200">Submit</button>
        </a-form>
    </a-modal>
    <a-modal v-model:open="isOpen" title="Profil" class="text-center" :footer="null" @cancel="closeOTP">
        <a-form :model="formProfil" autocomplete="off" @finish="updateProfil">
            <a-form-item name="name" :rules="[{ required: true, message: 'Nama Tidak Boleh Kosong' }]">
                <p class="ml-[4px] font-mono text-left">Nama</p>
                <a-input v-model:value="formProfil.name" placeholder="Nama"></a-input>
            </a-form-item>
            <a-form-item name="email"
                :rules="[{ required: true, message: 'Nama Tidak Boleh Kosong' }, { type: 'email', message: 'Input Email Yang Valid' }]">
                <p class="ml-[4px] font-mono text-left">Email</p>
                <a-input v-model:value="formProfil.email" placeholder="Email" :disabled="true"></a-input>
            </a-form-item>
            <a-form-item name="nomorTelepon" :rules="[{ required: true, message: 'Nomor Tidak Boleh Kosong' }]">
                <p class="ml-[4px] font-mono text-left">Nomor Telepon</p>
                <a-input v-model:value="formProfil.nomorTelepon" placeholder="08..."></a-input>
            </a-form-item>
            <button html-type="submit"
                class="font-bold  rounded-xl w-[3cm] text-red-600 h-[1cm] mx-auto border-[2px] hover:bg-red-200 border-red-600 transition-all duration-[0.5s]">Ubah</button>
        </a-form>
        <button
            class="font-bold  mt-[5px] rounded-xl w-[3cm] text-red-600 h-[1cm] mx-auto border-[2px] hover:bg-red-200 border-red-600 transition-all duration-[0.5s]"
            @click="resetPassword">Ubah Password</button>
        <div v-if="showOtp" class="mt-[0.5cm] w-fit mx-auto">
            <a-form :model="otp" autocomplete="off" @finish="verifOTP">
                <p class="text-[20px] font-bold mb-[5px]">PIN</p>
                <PinInput @update:pin="handlePinUpdate"></PinInput>
                <button type="submit"
                    class="border-2 border-red-600 rounded-md p-[4px] text-red-600 mt-[5px] hover:bg-red-200">Submit</button>
            </a-form>
        </div>
    </a-modal>
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
import PinInput from './template/Pin.vue'
import Footer from './template/Footer.vue'
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
            invoice: {},
            current: ref(0),
            formProfil: {
                name: '',
                email: '',
                nomorTelepon: ''
            },
            formReset: {
                oldPassword: '',
                newPassword: ''
            },
            otp: '',
            steps: [
                { title: 'Isi Data', content: 'First Content', component: StepOne },
                { title: 'Pilih Pembayaran', content: 'Second Content', component: StepTwo },
                { title: 'Faktur', content: 'Third Content', component: StepThree }
            ],
            items: [],
            isOpen: ref(false),
            showOtp: ref(false),
            isReset: ref(false),
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
            await axios.get(local + `reservasi-user/${id}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log('reservasi: ', res)

                    this.reservasis = res.data.data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))

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
                    this.formProfil.name = this.user.name
                    this.formProfil.email = this.user.email
                    this.formProfil.nomorTelepon = this.user.nomor_telepon
                    console.log('NOMOR TELEPON: ', this.formProfil.nomorTelepon)

                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                })

            await axios.get(local + `reservasi-user/${id}`, {
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
        async updateProfil() {
            const id = this.user.id
            const loadingMessage = message.loading('Mengubah...', 0)
            await axios.put(local + `update-profil/${id}?name=${this.formProfil.name}&nomor_telepon=${this.formProfil.nomorTelepon}`, {}, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    loadingMessage()
                    console.log('UPDATE: ', res)
                    console.log('ID UPDATE', id)
                    this.getUser()
                    message.success(res.data.message)
                })
                .catch((error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    message.error(error.response.data[0].nomor_telepon)
                })
        },
        async cetak(idReservasi) {
            const id = idReservasi
            await axios.get(local + `reservasi-id/${id}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log('RESERVASI CETAK: ', res)
                    this.invoice = res.data.data
                    setTimeout(() => {
                        window.print()
                    }, 1000)
                })

        },
        async cancel(idReservasi) {
            const id = idReservasi
            const loadingMessage = message.loading('Mengirim...', 2)
            await axios.post(local + `send-whatsapp-cancel/${id}`, {}, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    loadingMessage()
                    console.log(res)
                    message.success('Proses Cancel Berhasil Dikirim!', 2)
                })
                .catch((error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    message.success('Proses Cancel Gagal!', 2)
                })
        },
        async updatePassword() {
            const id = this.user.id
            const loadingMessage = message.loading('Memverifikasi...', 0)
            await axios.put(local + `password-change/${id}`, {
                old_password: this.formReset.oldPassword,
                new_password: this.formReset.newPassword
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    loadingMessage()
                    if (res.data.message == 'Password Tidak Sesuai!') {
                        message.error(res.data.message, 2)
                    } else {
                        this.isReset = false
                        this.showOtp = false
                        message.success(res.data.message, 2)
                    }
                })
                .catch((error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    message.error(error.response.data.message, 2)
                })
        },
        async verifOTP() {
            const id = this.user.id
            const loadingMessage = message.loading('Memverifikasi...', 0)
            await axios.post(local + `reset-otp/${id}`, {
                otp: this.otp
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    loadingMessage()
                    if (res.data.message == 'Kode OTP Salah!') {
                        message.error(res.data.message, 2)
                    } else {
                        this.isReset = true
                        message.success(res.data.message, 2)
                    }
                })
                .catch((error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    message.error(error.response.data.message, 2)
                })
        },
        async resetPassword() {
            const loadingMessage = message.loading('Membuat OTP...', 0)
            await axios.post(local + 'reset-password', {
                id_user: this.user.id
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    this.sendOTP()
                    loadingMessage()
                    console.log('RESET PASSWORD: ', res)
                    this.showOtp = true
                    message.success(res.data.message)
                })
                .catch((error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    message.error(error.response.data.message)
                })
        },
        async sendOTP() {
            const id = this.user.id
            await axios.get(local + `send-email-otp/${id}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
        },
        handlePinUpdate(pin) {
            this.otp = pin
        },
        profil() {
            this.isOpen = true
        },
        close() {
            this.isOpen = false
            this.isReset = false
        },
        closeOTP() {
            this.showOtp = false
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
                message.error('Mohon Lengkapi Data Reservasi Terlebih Dahulu!', 2)
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
        PinInput,
        Footer
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