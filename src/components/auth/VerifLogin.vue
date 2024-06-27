<template>
    <Alert :visible="alert.visible" :message="alert.message" :background="alert.background" :text="alert.text"
        class="mx-auto" />
    <Navbar></Navbar>
    <div class="transition-all duration-500 ease-in-out px-[1cm] py-[2cm]">
        <div
            class="mx-auto w-[10cm] mt-[1cm] border-2 border-red-600 bg-white text-black  p-[0.5cm] rounded-md font-mono transition-all duration-500">
            <a-form :model="formState" autocomplete="off"
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
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { local } from '../../api'
import axios from 'axios'

import { message } from 'ant-design-vue'

import Navbar from '../template/Navbar.vue'
import Alert from '../template/Alert.vue'
export default {
    data() {
        return {
            formState: {
                email: '',
                password: '',
            },
            id: ''
        }
    },
    computed: {
        ...mapState(['isLoggedIn', 'alert', 'idUser'])
    },
    methods: {
        ...mapActions(['login', 'showAlert', 'hideAlert']),
        async loginSubmit() {
            const loadingMessage = message.loading('Verifying',0)
            await axios.put(local + `login-verif?email=${this.formState.email}&password=${this.formState.password}`, {
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
                    message.success(res.data.message,2)
                    this.login()
                    this.$router.push('/dashboard')
                    this.email = ''; this.password = ''
                })
                .catch(async (error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    message.error(error.response.data.message, 2)
                    
                })
        },
    },
    components: {
        Navbar,
        Alert
    }
}
</script>