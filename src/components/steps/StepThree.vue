<template>
    <div class="w-[10cm] mx-auto mb-[1cm] print:hidden">
        <div class="mx-auto border border-black p-[0.5cm]">
            <p>INVOICE RESERVASI VILLA WATUSAMAN</p>
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
                    <p v-if="invoice.sisa_pembayaran == 0" class="font-bold text-green-500 text-[20px]">Status [ LUNAS ]</p>
                    <p v-else-if="invoice.sisa_pembayaran != 0" class="font-bold text-green-500 text-[20px]">Status [ DP ]
                    </p>
                </div>
            </div>
        </div>
        <div class="border p-[0.4cm] border-black">
            <p class="text-[12px]">*Silahkan Cetak Untuk Ditunjukan Ke Pihak Villa Waktu CheckIn</p>
        </div>
    </div>
    <div class="hidden print:block w-[10cm] mx-auto mb-[1cm] ">
        <div class="mx-auto border border-black p-[0.5cm]">
            <p>INVOICE RESERVASI VILLA WATUSAMAN</p>
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
                    <p v-if="invoice.sisa_pembayaran == 0" class="font-bold text-green-500 text-[20px]">Status [ LUNAS ]</p>
                    <p v-else-if="invoice.sisa_pembayaran != 0" class="font-bold text-green-500 text-[20px]">Status [ DP ]
                    </p>
                </div>
            </div>
        </div>
        <div class="border p-[0.4cm] border-black">
            <p class="text-[12px]">*Silahkan Cetak Untuk Ditunjukan Ke Pihak Villa Waktu CheckIn</p>
        </div>
    </div>
</template>
<script>
import { local } from '../../api'

import moment from 'moment';
import axios from 'axios';

export default {
    name: 'StepThree',
    data() {
        return {
            invoice: {}
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        async getData() {
            const id = localStorage.getItem('idUser')
            await axios.get(local + `reservasi-payed/${id}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log('payed', res)
                    this.invoice = res.data.data
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                })
        },
        formattedNumber(number) {
            if (typeof number !== 'number') {
                return '0';
            }
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        formattedDate(time) {
            return moment(time).format('DD MMM YYYY')
        }
    }
}
</script>