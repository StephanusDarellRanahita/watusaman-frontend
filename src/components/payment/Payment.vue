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
                    <p class="ml-[20px] flex gap-[5px]">DP<span class="ml-[17px]">:</span> Rp <a @click="copyToClipboard" class="flex">{{ formattedNumber(dp) }}<svg-icon type="mdi" :path="path.mdiContentCopy" class="h-[10px] my-auto"/></a></p>
                    <p class="ml-[20px] flex gap-[5px]">Lunas : Rp <a class="flex" @click="copyToClipboard">{{ formattedNumber(lunas) }}<svg-icon type="mdi" :path="path.mdiContentCopy" class="h-[10px] my-auto"/></a></p>
                </div>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="DANA">
                <DanaPayment />
            </a-collapse-panel>
            <a-collapse-panel key="3" header="m-BCA"></a-collapse-panel>
        </a-collapse>
    </div>
</template>
<script>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiContentCopy } from '@mdi/js'
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import DanaPayment from '../payment/Dana.vue'

import axios from 'axios';
import { local } from '../../api';
export default {
    name: 'BRIPayment',
    data() {
        return {
            activeKey: ref([]),
            dp: 0,
            lunas: 0,
            path: {
                mdiContentCopy
            }
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
                    this.dp = res.data.data.total_harga/2
                    this.lunas = res.data.data.total_harga
                    console.log('DP', this.dp)
                })
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