<template>
    <Navbar class="text-white text-[20px]">
        <button v-if="!isLoggedIn" class="my-auto" @click="admin">Admin</button>
        <button v-if="!isLoggedIn"
            :class="isRegister ? ['text-white'] : ['text-red-600', 'border-b', 'border-b-red-600', 'text-[25px]']"
            class="my-auto transition-all duration-500" @click="loginClick">Login
        </button>
        <button v-if="!isLoggedIn"
            :class="isRegister ? ['text-red-600', 'border-b', 'border-b-red-600', 'text-[25px]'] : ['text-white']"
            class="my-auto transition-all duration-500" @click="registerClick">Register</button>
    </Navbar>
    <div class="transition-all duration-500 items-center ease-in-out w-[15cm] lg:px-[1cm] py-[2cm] h-fit flex flex-col lg:flex-row gap-[1cm] lg:gap-[3cm] ml-[1.3cm] lg:ml-[1cm]">
        <div class="flex flex-col">
            <div class="mx-auto w-[10cm] mt-[1cm] border-2 border-red-600 bg-white text-black  p-[0.5cm] rounded-md font-mono transition-all duration-500"
                :class="isRegister ? 'h-[11cm]' : 'h-[9cm]'">
                <p class="font-bold text-center text-[40px] w-[8.92cm] transition-all duration-[0.5s]"
                    :class="isRegister ? ['opacity-0', 'ml-[6cm]'] : ['opacity-100']">LOGIN</p>
                <p class="font-bold text-center text-[40px] transition-all duration-[0.5s] absolute top-[3.5cm]  "
                    :class="isRegister ? ['opacity-100', 'left-[4.78cm]'] : ['opacity-0', 'left-[3cm]']">REGISTER</p>
                <div class="border-b-[3px] border-b-red-600 mb-[0.5cm]"></div>
                <a-form :class="isRegister ? 'opacity-0' : ['opacity-100', 'z-30']" :model="formState" autocomplete="off"
                    @finish="loginSubmit" class="flex flex-col font-mono login-form">
                    <a-form-item name="email"
                        :rules="[{ required: true, message: 'Email Tidak Boleh Kosong!' }, { type: 'email', message: 'Input Email Yang Valid!' }]">
                        <p class="ml-[4px] font-mono">Email</p>
                        <a-input type="email" v-model:value="formState.email" placeholder="Email"
                            class="font-mono border-2 border-black" />
                    </a-form-item>
                    <a-form-item name="password"
                        :rules="[{ required: true, message: 'Password Tidak Boleh Kosong!' }, { min: 3, message: 'Password Minimal 3 Digit!' }]">
                        <p class="ml-[4px]">Password</p>
                        <a-input-password v-model:value="formState.password" placeholder="Password"
                            class="font-mono border-2 border-black" />
                    </a-form-item>
                    <button html-type="submit"
                        class="font-bold  rounded-xl w-[3cm] h-[1cm] mx-auto border-[2px] hover:bg-red-200 border-red-600 transition-all duration-[0.5s] ease-in-out"
                        :class="isRegister ? ['opacity-100', 'mt-[2cm]'] : ['opacity-100',]">Submit</button>
                </a-form>
                <a-form class="flex flex-col login-form absolute top-[5.7cm] w-[8.9cm]" :model="formState" autocomplete="off"
                    @finish="registSubmit" :class="isRegister ? 'opacity-100' : ['opacity-0', '-z-20']">
                    <a-form-item name="name" :rules="[{ required: true, message: 'Nama Tidak Boleh Kosong!' }]">
                        <p class="ml-[4px] font-mono">Nama</p>
                        <a-input v-model:value="formState.name" placeholder="Nama" class="font-mono border-2 border-black" />
                    </a-form-item>
                    <a-form-item name="email"
                        :rules="[{ required: true, message: 'Email Tidak Boleh Kosong!' }, { type: 'email', message: 'Input Email Yang Valid!' }]">
                        <p class="ml-[4px] font-mono">Email</p>
                        <a-input v-model:value="formState.email" placeholder="Email" class="font-mono border-2 border-black" />
                    </a-form-item>
                    <a-form-item name="password"
                        :rules="[{ required: true, message: 'Password Tidak Boleh Kosong!' }, { min: 3, message: 'Password Minimal 3 Digit!' }]">
                        <p class="ml-[4px] font-mono">Password</p>
                        <a-input-password v-model:value="formState.password" placeholder="Password"
                            class="font-mono border-2 border-black" />
                    </a-form-item>
                    <button html-type="submit"
                        class="font-bold  rounded-xl w-[3cm] h-[1cm] mx-auto border-[2px] hover:bg-red-200 border-red-600 transition-all duration-[0.5s]"
                        :class="isRegister ? ['opacity-100'] : ['-m-[2cm]']">Submit</button>
                </a-form>
            </div>
            <button @click="scrollToFooter" class="container border border-red-600 mt-[0.5cm] rounded-md w-[7.5cm] mx-auto flex p-[0.2cm] hover:bg-red-300 transition-all duration-500">
                <svg-icon type="mdi" :path="path.mdiGoogleMaps"></svg-icon>
                <p class="text-[14px] ml-[4px] font-bold mt-[2px]">VILLA WATUSAMAN YOGYAKARTA</p>
            </button>
            <button @click="scrollToFooter" class="container border border-red-600 mt-[0.5cm] rounded-md w-[7.5cm] mx-auto flex p-[0.2cm] hover:bg-red-300 transition-all duration-500">
                <div class="flex mx-auto gap-[0.2cm]">
                    <svg-icon type="mdi" class="w-[20px]" :path="path.mdiPhoneClassic"></svg-icon>
                    <p class="text-[14px] font-bold mt-[2px]">CONTACT</p>
                </div>
            </button>
        </div>
        <div>
            <p class="font-bold text-center text-[40px]">Kamar</p>
            <div class=" border-t-2 border-b-2 rounded-md border-red-600 p-[0.5cm] w-[14.5cm] lg:w-[23.5cm] gap-[1cm] h-full flex overflow-x-scroll snap-x snap-mandatory">
                <div v-for="(data, index) in kamar" :key="index"
                    class="border-2 border-red-600 min-w-[7cm] h-[8.9cm] overflow-hidden text-center indent-1 rounded-md snap-center snap-always">
                    <img :src="data.image" class="h-[5cm] transition-all duration-[0.5s]" />
                    <p class="font-bold ">Kamar {{ data.nomor_kamar }} Tipe {{ data.tipe }}</p>
                    <p class="m-[0.5cm]">{{ data.deskripsi }}</p>
                </div>
                <div v-for="(data, index) in kamar" :key="index"
                    class="border-2 border-red-600 min-w-[7cm] h-[8.9cm] overflow-hidden text-center indent-1 rounded-md snap-center snap-always">
                    <img :src="data.image" class="h-[5cm] transition-all duration-[0.5s]" />
                    <p class="font-bold ">Kamar {{ data.nomor_kamar }} Tipe {{ data.tipe }}</p>
                    <p class="m-[0.5cm]">{{ data.deskripsi }}</p>
                </div>
            </div>
        </div>
    </div>
    <Footer id="footer-section">
        
    </Footer>
    <a-modal v-model:open="isOpen" title="PIN" class="text-center" @ok="loginAdmin">
        <PinInput @update:pin="handlePinUpdate" class="mx-auto w-fit"></PinInput>
    </a-modal>
</template>
<script>
import { local } from '../../api' //import URL for axios
import { mapActions, mapState } from 'vuex'
import { RouterLink } from 'vue-router'

import axios from 'axios'
import Navbar from '../template/Navbar.vue'
import Alert from '../template/Alert.vue'
import PinInput from '../template/Pin.vue'
import Footer from '../template/Footer.vue'

import { message } from 'ant-design-vue';

import SvgIcon from '@jamescoyle/vue-icon'
import { mdiGoogleMaps, mdiPhoneClassic } from '@mdi/js'

export default {
    data() {
        return {
            isPageTransitioning: false,
            isRegister: false,
            isOpen: false,
            pin: '',
            formState: {
                name: '',
                email: '',
                password: ''
            },
            kamar: [],
            path: {
                mdiGoogleMaps, mdiPhoneClassic
            }
        }
    },
    computed: {
        ...mapState(['isLoggedIn', 'alert', 'idUser']),
    },
    mounted() {
        console.log('Id: ', localStorage.getItem('idUser')),
            this.getKamar()
    },
    methods: {
        ...mapActions(['login', 'showAlert', 'hideAlert']),
        async loginSubmit() {
            const loadingMessage =  message.loading('Verifying', 0)
            await axios.post(local + 'login', {
                email: this.formState.email,
                password: this.formState.password
            }, {
                headers: {
                    Accept: 'application/json',
                }
            })
                .then(async (res) => {
                    loadingMessage()
                    console.log(res)
                    localStorage.setItem('token', res.data.token)
                    localStorage.setItem('idUser', res.data.user.data.id)
                    this.login()
                    this.email = ''; this.password = ''
                    this.$router.push('/dashboard')
                    message.success(res.data.message, 2)
                })
                .catch(async (error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    message.error(error.response.data.message, 2)
                })
        },
        async loginAdmin() {
            const loadingMessage = message.loading('Verifying', 0)
            await axios.post(local + `login-admin/${this.pin}`, {}, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(async (res) => {
                    loadingMessage()
                    console.log(res)
                    localStorage.setItem('token', res.data.token)
                    this.login()
                    this.pin = ''
                    this.isOpen = false
                    this.$router.push('/dashboardAdmin')
                    message.success(res.data.message,2)
                })
                .catch(async (error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    this.pin = ''
                    this.isOpen = false
                    message.error(error.response.data.message,2)
                })
        },
        async registSubmit() {
            const loadingMessage = message.loading('Loading', 0)
            await axios.post(local + 'register', {
                name: this.formState.name,
                email: this.formState.email,
                password: this.formState.password
            }, {
                headers: {
                    Accept: 'application/json',
                }
            })
                .then(async (res) => {
                    loadingMessage()
                    console.log(res)
                    this.emailSend()
                    this.isRegister = false
                    this.name = ''; this.email = ''; this.password = ''
                    message.success(res.data.message, 2)
                    
                })
                .catch(async (error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data.email)
                    this.name = ''; this.email = ''; this.password = ''
                    message.error(error.response.data.email, 2)
                })
        },
        async emailSend() {
            await axios.get(local + `send-email?email=${this.formState.email}&nama=${this.formState.name}`, {},{
                headers: {
                    Accept: 'application/json',
                }
            })
                .then(res => {
                    console.log(res)
                })
                .catch((error) => {
                    console.error(error.response)
                })
        },
        async getKamar() {
            await axios.get(local + 'kamars', {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res)
                    this.kamar = res.data.data.data.sort((a, b) => a.nomor_kamar - b.nomor_kamar)
                })
        },
        scrollToFooter() {
            const footerSection = document.getElementById('footer-section');
            if (footerSection) {
                footerSection.scrollIntoView({ behavior: 'smooth' })
            }
        },
        handlePinUpdate(pin) {
            this.pin = pin
        },
        admin() {
            this.isOpen = true
        },
        loginClick() {
            this.isRegister = false
        },
        registerClick() {
            this.isRegister = true
        }
    },
    components: {
        Navbar,
        Alert,
        PinInput,
        Footer,
        RouterLink,
        SvgIcon
    }
}
</script>