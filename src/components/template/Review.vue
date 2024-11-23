<template>
    <div class="flex lg:flex-row flex-col gap-[1cm] lg:gap-0 divide-x-[3px] ml-[20px]">
        <div>
            <p class="text-[25px] font-bold mb-[0.5cm]">ULASAN</p>
            <div class="flex justify-center w-full">
                <div>
                    <div class="w-[13cm] lg:w-[17cm]">
                        <div class="h-fit">
                            <p class="text-start">Sortir Penilaian :</p>
                            <div class="flex gap-[20px] mb-[10px]">
                                <a-rate v-model:value="rateFilter" @change="rateChange" allowClear="true"></a-rate>
                                <button @click="clearRating">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                        class="h-[20px] mt-[8px] fill-red-600">
                                        <title>close-circle</title>
                                        <path
                                            d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-[10px] w-[13cm] lg:w-full">
                        <div class="overflow-auto h-[9.5cm] border-2 border-red-600 p-[10px] w-[17cm]">
                            <div v-for="(data, index) in review" :key="index"
                                class="rounded-md border-2 pb-[10px] px-[10px] mb-[10px]">
                                <div class="flex gap-[10px] ">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                        class="h-[55px] fill-gray-200">
                                        <title>account-circle</title>
                                        <path
                                            d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" />
                                    </svg>
                                    <div class="text-start">
                                        <p class="text-[20px] font-bold">{{ data.user.name }}</p>
                                        <p class="text-[15px]">{{ data.user.email }}</p>
                                    </div>
                                </div>
                                <p class="text-left">{{ formattedDate(data.updated_at) }}</p>
                                <a-rate v-model:value="data.bintang" :disabled="true"></a-rate>
                                <p class="border-2 text-start p-[3px] h-[2cm] border-e-2 overflow-y-scroll">{{ data.ulasan }}</p>
                            </div>
                        </div>
                        <div class="lg:w-[5cm] w-[3cm]">
                            <p class="font-bold">Ulasan : {{ jumlahReview }}</p>
                            <div v-for="i in 5" :key="i" class="flex gap-[5px] items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                    class="h-[20px] my-auto fill-yellow-300">
                                    <title>star</title>
                                    <path
                                        d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                                </svg>
                                <p class="mb-[1px]">{{ i }}</p>
                                <a-slider v-model:value="jumlah['bintang' + i].length" :max="jumlahReview" class="w-[3cm]"
                                    :disabled="true"></a-slider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="selfForm.ulasan">
            <p class="font-bold text-[25px] lg:mb-[1.9cm]">ULASAN ANDA</p>
            <a-form :model="form" @finish="updateReview" class="w-[13cm] lg:w-[17cm] mx-auto p-[10px]">
                <div class="border-2 rounded-md px-[10px]">
                    <a-form-item :rules="[{ required: true, message: 'Bintang Tidak Boleh Kosong' }]">
                        <a-rate v-model:value="form.bintang"></a-rate>
                    </a-form-item>
                    <a-form-item :rules="[{ required: true, message: 'Ulasan Tidak Boleh Kosong' }]">
                        <a-textarea v-model:value="form.ulasan" placeholder="Masukkan Ulasan Anda..."
                            :auto-size="{ minRows: 3, maxRows: 3 }"></a-textarea>
                    </a-form-item>
                </div>
                <button type="submit"
                    class="font-bold text-white bg-red-600 border-2 border-red-600 rounded-md p-[5px] hover:bg-red-400 mt-[10px]">
                    Ubah Ulasan
                </button>
            </a-form>
        </div>
        <div v-if="!selfForm.ulasan">
            <p class="font-bold text-[25px] mb-[1.9cm]">ULASAN ANDA</p>
            <a-form :model="form" @finish="submitReview" class="w-[17cm] mx-auto p-[10px]">
                <div class="border-2 rounded-md px-[10px]">
                    <a-form-item :rules="[{ required: true, message: 'Bintang Tidak Boleh Kosong' }]">
                        <a-rate v-model:value="form.bintang"></a-rate>
                    </a-form-item>
                    <a-form-item :rules="[{ required: true, message: 'Ulasan Tidak Boleh Kosong' }]">
                        <a-textarea v-model:value="form.ulasan" placeholder="Masukkan Ulasan Anda..."
                            :auto-size="{ minRows: 3, maxRows: 3 }"></a-textarea>
                    </a-form-item>
                </div>
                <button type="submit"
                    class="font-bold text-white bg-red-600 border-2 border-red-600 rounded-md p-[5px] hover:bg-red-400 mt-[10px]">
                    Kirim Ulasan
                </button>
            </a-form>
        </div>
    </div>
</template>
<script>
import { local } from '../../api'
import { message } from 'ant-design-vue'
import axios from 'axios'
import { ref } from 'vue'

import moment from 'moment/dist/moment'

export default {
    nama: 'TemplateReview',
    data() {
        return {
            form: {
                bintang: ref(0),
                ulasan: '',
            },
            selfForm: {
                bintang: ref(0),
                ulasan: ''
            },
            rateFilter: ref(0),
            review: [],
            ratings: [
                1, 2, 3, 4, 5
            ],
            jumlah: {
                bintang1: 0,
                bintang2: 0,
                bintang3: 0,
                bintang4: 0,
                bintang5: 0,

            },
            jumlahReview: 0
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        async getData() {
            await axios.get(local + 'review', {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log('REVIEW',res)
                    const reviews = res.data.data
                    const idUser = parseInt(localStorage.getItem('idUser'), 10);

                    if (this.rateFilter === 0) {
                        const userReview = reviews.find(data => data.id_user === idUser);
                        if (userReview) {
                            this.form.ulasan = userReview.ulasan
                            this.form.bintang = userReview.bintang

                            this.selfForm.ulasan = userReview.ulasan
                        }
                        this.review = reviews.sort((a, b) => b.bintang - a.bintang)
                    } else {
                        this.review = reviews.filter(data => data.bintang === this.rateFilter);
                    }
                    this.jumlahReview = res.data.data.length
                    this.jumlah = {
                        bintang1: reviews.filter(data => data.bintang === 1),
                        bintang2: reviews.filter(data => data.bintang === 2),
                        bintang3: reviews.filter(data => data.bintang === 3),
                        bintang4: reviews.filter(data => data.bintang === 4),
                        bintang5: reviews.filter(data => data.bintang === 5),
                    }
                    console.log('JUMLAH : ', this.jumlah)
                })
        },
        async submitReview() {
            const id = localStorage.getItem('idUser')
            const loadingMessage = message.loading('Mengirim Ulasan...', 0)
            await axios.post(local + `review/${id}`, {
                bintang: this.form.bintang,
                ulasan: this.form.ulasan
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    loadingMessage()
                    console.log(res)
                    message.success(res.data.message, 2)
                    this.getData()
                })
                .catch((error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    message.error(error.response.data.message, 2)
                })
        },
        async updateReview() {
            const id = localStorage.getItem('idUser')
            const loadingMessage = message.loading('Mengirim Ulasan...', 0)
            await axios.put(local + `update-review/${id}?bintang=${this.form.bintang}&ulasan=${this.form.ulasan}`, {}, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    loadingMessage()
                    console.log(res)
                    message.success(res.data.message, 2)
                    this.getData()
                })
                .catch((error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    message.error(error.response.data.message, 2)
                    this.getData()
                })
        },
        formattedDate(time) {
            return moment(time).format('LL')
        },
        rateChange() {
            console.log('RATE FILTER :', this.rateFilter)
            this.getData()
        },
        clearRating() {
            this.rateFilter = 0
            this.getData()
        }
    }
}
</script>