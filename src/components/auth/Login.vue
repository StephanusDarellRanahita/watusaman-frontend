<template>
    <Alert :visible="alert.visible" :message="alert.message" :background="alert.background" :text="alert.text" class="mx-auto"/>
    <Navbar>
        <button v-if="!isLoggedIn" :class="isRegister ? ['text-black'] : ['text-orange-600', 'border-b', 'border-b-orange-600'] " class="my-auto transition-all duration-500" @click="loginClick">Login
        </button>
        <button v-if="!isLoggedIn" :class="isRegister ? ['text-orange-600', 'border-b', 'border-b-orange-600'] : ['text-black']" class="my-auto transition-all duration-500" @click="registerClick">Register</button>
    </Navbar>
    <div :class="isRegister ? 'ml-[5cm]' : 'ml-[1cm]'" class="transition-all duration-500 ease-in-out px-[1cm] py-[2cm]">
        <div class="ml-[2cm] w-fit mt-[1cm] border-2 border-yellow-200 bg-yellow-50 rounded-tr-xl p-[0.5cm] rounded-bl-xl">
            <p class="font-bold text-center transition-all ease-in-out duration-[5s]">{{ isRegister ? 'Register' : 'Login'
            }}</p><br>
            <form v-if="!isRegister" @submit.prevent="loginSubmit" class="flex flex-col gap-[0.5cm] login-form">
                <a-input type="email" v-model:value="email" placeholder="Email" required />
                <a-input type="password" v-model:value="password" placeholder="Password" required />
                <button type="submit" class="font-bold bg-yellow-200 rounded-xl w-[3cm] h-[1cm] mx-auto">Submit</button>
            </form>
            <form v-else-if="isRegister" @submit.prevent="registSubmit" class="flex flex-col gap-[0.5cm] login-form">
                <a-input type="name" v-model:value="name" placeholder="Name" required />
                <a-input type="email" v-model:value="email" placeholder="Email" required />
                <a-input type="password" v-model:value="password" placeholder="Password" required />
                <button type="submit" class="font-bold bg-yellow-200 rounded-xl w-[3cm] h-[1cm] mx-auto">Submit</button>
            </form>
        </div>
        <div class="absolute bg-repeat opacity-[5%] inset-10 -z-10" style="background-image: url('/Cloud.png');"></div>
    </div>
</template>
<script>
import axios from 'axios'
import { local } from '../../api' //import URL for axios
import { mapActions, mapState } from 'vuex'
import { RouterLink } from 'vue-router'
import Navbar from '../template/Navbar.vue'
import Alert from '../template/Alert.vue'

export default {
    data() {
        return {
            name: '',
            email: '',
            password: '',
            isPageTransitioning: false,
            isRegister: false
        }
    },
    computed: {
        ...mapState(['isLoggedIn', 'alert', 'idUser']),
    },
    mounted() {
        console.log('Id: ', localStorage.getItem('idUser'))
    },
    methods: {
        ...mapActions(['login', 'showAlert', 'hideAlert']),
        async loginSubmit() {
            await axios.post(local + 'login', {
                email: this.email,
                password: this.password
            }, {
                headers: {
                    Accept: 'application/json',
                }
            })
                .then(async (res) => {
                    this.showAlert({ message: res.data.message, background: "bg-green-300", text: "text-black" })
                    console.log(res)
                    localStorage.setItem('token', res.data.data)
                    localStorage.setItem('idUser', res.data.data.id)
                    this.login()
                    await new Promise((resolve) => {
                        setTimeout(() => {
                            this.hideAlert();
                            resolve();
                        }, 2000);
                    });
                    this.email = ''; this.password = ''
                    this.$router.push('/dashboard')
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                    this.showAlert({ message: error.response.data.message, background: "bg-red-500", text: "text-white" })
                    new Promise((resolve) => {
                        setTimeout(() => {
                            this.hideAlert();
                            resolve();
                        }, 2000);
                    });
                    this.email = ''; this.password = ''
                })
        },
        async registSubmit() {
            await axios.post(local + 'register', {
                name: this.name,
                email: this.email,
                password: this.password
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res)
                    this.showAlert({ message: res.data.message, background: "bg-green-300", text: "text-black" })
                    new Promise((resolve) => {
                        setTimeout(() => {
                            this.hideAlert();
                            resolve();
                        }, 2000);
                    });
                    this.isRegister = false
                    this.name = ''; this.email = ''; this.password = ''
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(console.error(error.response.data))
                    this.showAlert({ message: error.reponse.data.message, background: "bg-red-500", text: "text-white+" })
                    new Promise((resolve) => {
                        setTimeout(() => {
                            this.hideAlert();
                            resolve();
                        }, 2000);
                    });
                    this.name = ''; this.email = ''; this.password = ''
                })
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
        RouterLink
    }
}
</script>