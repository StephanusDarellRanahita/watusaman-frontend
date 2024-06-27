<template>
    <Alert :visible="alert.visible" :message="alert.message" :background="alert.background" :text="alert.text" class="z-50 mx-auto"/>
    <Navbar></Navbar>
    <div
        class="absolute z-50 mt-[5cm] ml-[25cm] p-[1cm] rounded-md text-white flex flex-col gap-[0.5cm] border bg-gradient-to-b from-[#2196f3] from-80% to-white">
        <p class="font-bold text-center mb-[0.5cm]">LOGIN</p>
        <form @submit.prevent="loginSubmit" class="flex flex-col gap-[0.5cm]">
            <div class="flex flex-col">
                <p class="text-[12px]">Nomor</p>
                <a-input v-model:value="nomor" class="p-[0.1cm] rounded-md" placeholder="Nomor telepon"></a-input>
            </div>
            <div>
                <p class="text-[12px]">Password</p>
                <a-input-password v-model:value="password" class="p-[0.1cm] rounded-md" placeholder="Password"></a-input-password>
            </div>
            <button class="mx-auto border-2 rounded-md w-fit px-[0.2cm]">submit</button>
        </form>
    </div>
    <div class="absolute z-30 opacity-70">
        <video autoplay loop muted class="w-screen">
            <source src="/DanaVideo.mp4" type="video/mp4">
        </video>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { local } from '../../api';

import Navbar from '../template/NavbarDana.vue';
import Alert from '../template/Alert.vue'

import axios from 'axios';

export default {
    data() {
        return {
            nomor: '',
            password: ''
        }
    },
    computed: {
        ...mapState(['isLoggesInDana', 'alert'])
    },
    mounted() {
        
    },
    methods: {
        ...mapActions(['loginDana', 'showAlert', 'hideAlert']),
        async loginSubmit() {
            await axios.post(local + 'login-dana', {
                nomor_telepon: this.nomor,
                password: this.password
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(async (res) => {
                    console.log(res)
                    this.showAlert({ message: res.data.message, background: "bg-green-600", text: "text-white" })
                    localStorage.setItem('tokenDana', res.data.token)
                    localStorage.setItem('idUserDana', res.data.user.data.id)
                    console.log('idUserDana: ', localStorage.getItem('idUserDana'))
                    this.loginDana()
                    await new Promise((resolve) => {
                        setTimeout(() => {
                            this.hideAlert()
                            resolve()
                        }, 2000)
                    })
                    this.nomor = ''; this.password = ''
                    this.$router.push('/dashboardDana')
                })
                .catch(async (error) => {
                    console.error(error.response)
                    console.error(error.response.data.message)
                    this.showAlert({ message: error.response.data.message, background: 'bg-red-500', text: "text-white" })
                    await new Promise((resolve) => {
                        setTimeout(() => {
                            this.hideAlert() 
                            resolve()
                        }, 2000)
                    })
                })
        }   
    },
    components: {
        Navbar,
        Alert
    }
}
</script>