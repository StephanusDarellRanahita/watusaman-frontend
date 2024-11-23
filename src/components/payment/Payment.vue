<template>
    <div class="border-2 w-[11cm] mx-auto text-black bg-white font-semibold rounded-md mb-[0.2cm] py-[0.5cm]">
        <div class="border-b">
            <img src="/BRI.png" class="h-[20px] mx-auto mb-[10px]" />
        </div>
        <p class="text-[15px]">No Rekening BRI</p>
        <p @click="copyToClipboard" class="cursor-pointer text-red-600 flex gap-[10px] justify-center mt-[10px]">3011 0100
            3470 509
            <svg-icon type="mdi" :path="path.mdiContentCopy" class="h-[15px] my-auto" />
        </p>
        <p class="text-[15px] mb-[1cm]">a.n DIONYSIUS OKTAVIANTO</p>
        <p>Transfer Instruction</p>
        <a-collapse v-model:activeKey="activeKey" class="rounded-none text-start">
            <a-collapse-panel key="1" header="BRIMO" class="text-start">
                <div class="px-[20px]">
                    <p>1. Pilih Transfer</p>
                    <p>2. Tambah Penerima Baru</p>
                    <p>3. Pilih Bank Tujuan BRI</p>
                    <p class="flex gap-[5px]">4. Paste Nomor Rekening <a @click="copyToClipboard"
                            class="flex text-red-600">3011 0100 3470 509<svg-icon type="mdi" :path="path.mdiContentCopy"
                                class="h-[10px] my-auto" /></a></p>
                    <p>5. Masukkan Nominal Transfer Berikut :</p>
                    <p class="ml-[20px] flex gap-[5px]">DP<span class="ml-[17px]">:</span> Rp <a @click="copyToClipboard"
                            class="flex">{{ formattedNumber(dp) }}<svg-icon type="mdi" :path="path.mdiContentCopy"
                                class="h-[10px] my-auto" /></a></p>
                    <p class="ml-[20px] flex gap-[5px]">Lunas : Rp <a class="flex" @click="copyToClipboard">{{
                        formattedNumber(lunas) }}<svg-icon type="mdi" :path="path.mdiContentCopy"
                                class="h-[10px] my-auto" /></a></p>
                    <p>6. Unggah Bukti Pembayaran</p>
                    <input type="file" id="file" @change="onChangeFileUpload" class="mt-[10px]" accept="image/png, image/jpeg" />
                    <button type="submit" @click="uploadBukti('BRI')"
                        class="border-2 border-red-600 h-fit rounded-md p-[4px] text-red-600 hover:bg-red-200">Kirim</button>
                </div>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="DANA">
                <DanaPayment />
            </a-collapse-panel>
            <a-collapse-panel key="3" header="m-BCA">
                <div class="px-[20px]">
                    <p>1. Pilih Transfer</p>
                    <p>2. Pilih Transfer Valas ke Bank Lain</p>
                    <p class="flex gap-[5px]">3. Paste Nomor Rekening <a @click="copyToClipboard"
                            class="flex text-red-600">3011
                            0100 3470 509<svg-icon type="mdi" :path="path.mdiContentCopy" class="h-[10px] my-auto" /></a>
                    </p>
                    <p>4. Masukkan Nominal Transfer Berikut :</p>
                    <p class="ml-[20px] flex gap-[5px]">DP<span class="ml-[17px]">:</span> Rp <a @click="copyToClipboard"
                            class="flex">{{ formattedNumber(dp) }}<svg-icon type="mdi" :path="path.mdiContentCopy"
                                class="h-[10px] my-auto" /></a></p>
                    <p class="ml-[20px] flex gap-[5px]">Lunas : Rp <a class="flex" @click="copyToClipboard">{{
                        formattedNumber(lunas) }}<svg-icon type="mdi" :path="path.mdiContentCopy"
                                class="h-[10px] my-auto" /></a></p>
                    <p>5. Unggah Bukti Pembayaran</p>
                    <input type="file" id="file" @change="onChangeFileUpload" class="mt-[10px]" accept="image/*" />
                    <button type="submit" @click="uploadBukti('BCA')"
                        class="border-2 border-red-600 h-fit rounded-md p-[4px] text-red-600 hover:bg-red-200">Kirim</button>
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>
<script>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiContentCopy, mdiUpload } from '@mdi/js'
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import DanaPayment from '../payment/Dana.vue'

import axios from 'axios';
import { local } from '../../api';
export default {
    name: 'Payment',
    data() {
        return {
            activeKey: ref([]),
            dp: 0,
            lunas: 0,
            path: {
                mdiContentCopy, mdiUpload
            },
            tipe: '',
            reservasi: {},
            dataRes: {},
            bukti: null
        }
    },
    mounted() {
        this.getReservasi()
    },
    methods: {
        async getReservasi() {
            const id = localStorage.getItem('idUser')
            await axios.get(local + `reservasi-payment/${id}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res)
                    this.dp = res.data.data.total_harga / 2
                    this.lunas = res.data.data.total_harga
                    this.reservasi = res.data.data.id
                    this.dataRes = res.data.data
                    console.log('DP', this.dp)
                })
        },
        async uploadBukti(tipe) {
            this.tipe = tipe
            const formData = new FormData();
            formData.append('bukti', this.bukti);
            formData.append('id_user', localStorage.getItem('idUser'));
            formData.append('id_reservasi', this.reservasi);
            formData.append('tipe', this.tipe);
            console.log('BUKTI : ', this.bukti)
            const loadingMessage = message.loading('Mengirim Bukti...', 0)
            await axios.post(local + 'bukti', formData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(async (res) => {
                    loadingMessage()
                    console.log(res)
                    this.isOpen = false
                    this.sendWhatsApp()
                    message.success(res.data.message, 2)
                })
                .catch(async (error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    this.isOpen = false
                    message.error(error.response.data.message, 2)
                })
        },
        async sendWhatsApp() {
            await axios.post(local + 'send-whatsapp', {
                start_date: this.dataRes.start_date,
                end_date: this.dataRes.end_date,
                nama: this.dataRes.nama,
                nomor_telepon: this.dataRes.nomor_telepon,
                dewasa: this.dataRes.dewasa,
                anak: this.dataRes.anak,
                pesan: 'Mengirim Bukti Pembayaran Bank'
            })
        },
        cobaUploadBukti(tipe) {
            console.log('DATA : ', this.dataRes.nama, tipe)
        },
        onChangeFileUpload(event) {
            const file = event.target.files[0]
            this.bukti = file
            console.log('FILE: ', this.bukti)
        },
        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('You can only upload JPG/PNG file!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must smaller than 2MB!');
            }
            return isJpgOrPng && isLt2M;
        },
        formattedNumber(number) {
            if (typeof number !== 'number') {
                return '0';
            }
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        copyToClipboard() {
            const textToCopy = "3011 0100 3470 509";
            navigator.clipboard.writeText(textToCopy).then(() => {
                message.success('Berhasil Dicopy Ke Clipboard!', 2)
            }).catch(err => {
                console.error("Failed to copy text: ", err);
            });
        }
    },
    components: {
        SvgIcon,
        DanaPayment
    }

}
</script>