<template>
    <Navbar class="print:hidden"></Navbar>
    <div class="pt-[3cm] w-fit px-[0.5cm] lg:w-full">
        <div class="flex flex-col mx-auto w-fit gap-[0.5cm] print:hidden">
            <div class="flex justify-between">
                <div class="flex gap-[1cm]">
                    <a-input v-model:value="searchQuery" class="w-fit" placeholder="cari nama, nomor telepon..."></a-input>
                    <a-date-picker v-model:value="tahun" picker="year" @change="yearChange"></a-date-picker>
                </div>
                <p class="mt-auto font-bold text-[20px]">DAFTAR RESERVASI</p>
            </div>
            <table class="order-2 w-[25cm]">
                <thead>
                    <tr>
                        <th v-for="(column, index) in columns" :key="index"
                            class="border-2 p-[0.1cm] border-red-600 bg-red-300">
                            {{ column.title }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, index) in filteredReservasi" :key="index"
                        :class="index % 2 == 0 ? 'bg-gray-100' : ''">
                        <td class="border-2 p-[0.1cm] text-center ">
                            {{ index + 1 }}
                        </td>
                        <td v-for="(body, index) in columns.slice(1)" :key="index" class="border-2  p-[0.2cm]">
                            <p v-if="body.title === 'Check In' || body.title === 'Check Out'"> {{
                                formattedDate(data[body.dataIndex]) }}</p>
                            <p v-else-if="body.title === 'Total Harga' || body.title === 'Kekurangan'">Rp {{
                                formattedNumber(data[body.dataIndex]) }}</p>
                            <p v-else>{{ data[body.dataIndex] }}</p>
                            <div v-if="body.title === 'Aksi'" class="flex mx-auto w-fit gap-[5px]">
                                <button v-if="data.status === 'PERMINTAAN BATAL'" @click="cancelReservasi(data.id)"
                                    class="text-red-600 border-2 border-red-600 rounded md p-[4px] hover:bg-red-200">Batal</button>
                                <button v-if="data.status === 'KONFIRMASI PEMBAYARAN'" @click="buktiPembayaran(data.id)"
                                    class="text-red-600 border-2 border-red-600 rounded md p-[4px] hover:bg-red-200">Lihat
                                    Bukti</button>
                                <button v-if="data.status === 'BATAL'" @click="deleteReservasi(data.id)"><svg-icon
                                        type="mdi" :path="path.mdiDeleteForeverOutline"></svg-icon></button>
                                <button @click="preview(data.id)">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                        class="h-[20px] fill-green-600">
                                        <title>magnify-plus-outline</title>
                                        <path
                                            d="M15.5,14L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5M9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14M12,10H10V12H9V10H7V9H9V7H10V9H12V10Z" />
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <a-pagination v-model:current="current" show-quick-jumper :total="total" :page-size="totalData.per_page"
            @change="currentChange" class="lg:ml-[19cm] mt-[0.5cm] ml-[11.5cm] print:hidden" />
        <div v-if="isComp" class="mx-auto w-fit mt-[1cm] rounded-md flex gap-[1cm] print:hidden">
            <a-date-picker v-model:value="tahunPertama" picker="year" placeholder="Tahun Pertama" class="border-black"
                @change="yearCompareChange"></a-date-picker>
            <a-date-picker v-model:value="tahunKedua" picker="year" placeholder="Tahun Kedua" class="border-black"
                @change="yearCompareChange"></a-date-picker>
        </div>
        <div class="hidden mx-auto my-auto w-fit h-fit print:block">
            <p v-if="!isComp" class="text-[40px] font-bold">GRAFIK PENDAPATAN {{ new Date(inputTahun).getFullYear() }}</p>
            <p v-else class="text-[40px] font-bold">GRAFIK PENDAPATAN {{ new Date(inputTahun1).getFullYear() }} - {{ new
                Date(inputTahun2).getFullYear() }}</p>
            <p class="text-[30px] underline decoration-red-600 font-bold text-center">Villa<a
                    class="text-red-600">W</a>atusaman</p>
        </div>
        <div class="flex justify-center">
            <div class="my-auto -rotate-90 -ml-[4.5cm] w-fit h-fit">
                <p v-if="!isComp"
                    class="text-[40px] font-bold bg-clip-text text-transparent bg-gradient-to-tr from-blue-400 to-green-400">
                    GRAFIK PENDAPATAN {{ new Date(inputTahun).getFullYear() }}</p>
                <p v-else
                    class="text-[40px] font-bold bg-clip-text text-transparent bg-gradient-to-tr from-blue-400 to-green-400">
                    GRAFIK PENDAPATAN
                <p class="text-center mb-[1cm]">{{ new Date(inputTahun1).getFullYear() }} - {{ new
                    Date(inputTahun2).getFullYear() }}</p>
                </p>
            </div>
            <div class="w-fit mt-[1cm] flex gap-[1cm] mb-[1cm] -ml-[4.75cm]">
                <apexchart v-if="!isComp" width="700" :options="options" :series="pendapatan"
                    class="mx-auto my-auto bg-white rounded-md">
                </apexchart>
                <apexchart v-if="isComp" width="700" :options="options" :series="comparedData"
                    class="mx-auto my-auto bg-white rounded-md">
                </apexchart>
                <div class="border p-[5px] print:hidden">
                    <p class="font-mono text-[15px] text-center">Ekspor Excel: </p>
                    <button v-if="!isComp" @click="exportToExcel"
                        class="text-black border-[2px] border-green-600 h-fit mx-[17px] mt-[3px] rounded p-[5px] hover:bg-green-100">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-green-600 w-[1cm]">
                            <path
                                d="M21.17 3.25Q21.5 3.25 21.76 3.5 22 3.74 22 4.08V19.92Q22 20.26 21.76 20.5 21.5 20.75 21.17 20.75H7.83Q7.5 20.75 7.24 20.5 7 20.26 7 19.92V17H2.83Q2.5 17 2.24 16.76 2 16.5 2 16.17V7.83Q2 7.5 2.24 7.24 2.5 7 2.83 7H7V4.08Q7 3.74 7.24 3.5 7.5 3.25 7.83 3.25M7 13.06L8.18 15.28H9.97L8 12.06L9.93 8.89H8.22L7.13 10.9L7.09 10.96L7.06 11.03Q6.8 10.5 6.5 9.96 6.25 9.43 5.97 8.89H4.16L6.05 12.08L4 15.28H5.78M13.88 19.5V17H8.25V19.5M13.88 15.75V12.63H12V15.75M13.88 11.38V8.25H12V11.38M13.88 7V4.5H8.25V7M20.75 19.5V17H15.13V19.5M20.75 15.75V12.63H15.13V15.75M20.75 11.38V8.25H15.13V11.38M20.75 7V4.5H15.13V7Z" />
                        </svg>
                    </button>
                    <button v-if="isComp" @click="exportCompareToExcel"
                        class="text-black border-[2px] border-green-600 h-fit mx-[17px] mt-[3px] rounded p-[5px] hover:bg-green-100">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-green-600 w-[1cm]">
                            <path
                                d="M21.17 3.25Q21.5 3.25 21.76 3.5 22 3.74 22 4.08V19.92Q22 20.26 21.76 20.5 21.5 20.75 21.17 20.75H7.83Q7.5 20.75 7.24 20.5 7 20.26 7 19.92V17H2.83Q2.5 17 2.24 16.76 2 16.5 2 16.17V7.83Q2 7.5 2.24 7.24 2.5 7 2.83 7H7V4.08Q7 3.74 7.24 3.5 7.5 3.25 7.83 3.25M7 13.06L8.18 15.28H9.97L8 12.06L9.93 8.89H8.22L7.13 10.9L7.09 10.96L7.06 11.03Q6.8 10.5 6.5 9.96 6.25 9.43 5.97 8.89H4.16L6.05 12.08L4 15.28H5.78M13.88 19.5V17H8.25V19.5M13.88 15.75V12.63H12V15.75M13.88 11.38V8.25H12V11.38M13.88 7V4.5H8.25V7M20.75 19.5V17H15.13V19.5M20.75 15.75V12.63H15.13V15.75M20.75 11.38V8.25H15.13V11.38M20.75 7V4.5H15.13V7Z" />
                        </svg>
                    </button>
                    <p class="font-mono text-[15px] text-center mt-[10px]">Ekspor Pdf: </p>
                    <button v-if="!isComp" @click="exportToPdf"
                        class="text-black border-[2px] border-red-600 h-fit mx-[17px] mt-[3px] rounded p-[5px] hover:bg-red-100">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-red-600 w-[1cm]">
                            <title>file-pdf-box</title>
                            <path
                                d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M9.5 11.5C9.5 12.3 8.8 13 8 13H7V15H5.5V9H8C8.8 9 9.5 9.7 9.5 10.5V11.5M14.5 13.5C14.5 14.3 13.8 15 13 15H10.5V9H13C13.8 9 14.5 9.7 14.5 10.5V13.5M18.5 10.5H17V11.5H18.5V13H17V15H15.5V9H18.5V10.5M12 10.5H13V13.5H12V10.5M7 10.5H8V11.5H7V10.5Z" />
                        </svg>
                    </button>
                    <button v-if="isComp" @click="exportToPdf"
                        class="text-black border-[2px] border-red-600 h-fit mx-[17px] mt-[3px] rounded p-[5px] hover:bg-red-100">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-red-600 w-[1cm]">
                            <title>file-pdf-box</title>
                            <path
                                d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M9.5 11.5C9.5 12.3 8.8 13 8 13H7V15H5.5V9H8C8.8 9 9.5 9.7 9.5 10.5V11.5M14.5 13.5C14.5 14.3 13.8 15 13 15H10.5V9H13C13.8 9 14.5 9.7 14.5 10.5V13.5M18.5 10.5H17V11.5H18.5V13H17V15H15.5V9H18.5V10.5M12 10.5H13V13.5H12V10.5M7 10.5H8V11.5H7V10.5Z" />
                        </svg>
                    </button>
                    <div class="text-center">
                        <p class="mt-[1cm]">Perbandingan</p>
                        <a-switch v-model:checked="isComp"></a-switch>
                    </div>
                </div>
                <div v-if="!isComp" class="hidden lg:block print:block">
                    <span v-for="(data, index) in dataPdf" :key="index">
                        <div v-if="index == 0" class="flex font-bold text-center">
                            <p class="border-2 bg-red-300 border-red-600 p-[10px] w-[3cm]">Bulan</p>
                            <p class="border-2 bg-red-300 border-red-600 border-l-0 p-[10px] w-[4cm]">Pendapatan</p>
                        </div>
                        <div class="flex gap-0 text-left" :class="index % 2 === 0 ? 'bg-gray-100' : ''">
                            <p class="border-2 p-[10px] border-t-0 w-[3cm]">{{ data.Bulan }}</p>
                            <p class="border-2 border-l-0 border-t-0 p-[10px] w-[4cm]">Rp {{
                                formattedNumber(data.Pendapatan) }}</p>
                        </div>
                    </span>
                </div>
            </div>
        </div>
        <div v-if="!isComp">
            <div class="mx-auto w-fit lg:hidden print:block print:hidden">
                <span v-for="(data, index) in dataPdf" :key="index">
                    <div v-if="index == 0" class="flex font-bold text-center">
                        <p class="border-2 bg-red-300 border-red-600 p-[10px] w-[3cm]">Bulan</p>
                        <p class="border-2 bg-red-300 border-red-600 border-l-0 p-[10px] w-[4cm]">Pendapatan</p>
                    </div>
                    <div class="flex gap-0 text-left" :class="index % 2 === 0 ? 'bg-gray-100' : ''">
                        <p class="border-2 p-[10px] border-t-0 w-[3cm]">{{ data.Bulan }}</p>
                        <p class="border-2 border-l-0 border-t-0 p-[10px] w-[4cm]">Rp {{ formattedNumber(data.Pendapatan) }}
                        </p>
                    </div>
                </span>
            </div>
        </div>
        <div class="flex gap-[2cm] mt-[1cm] justify-center print:mt-[6cm] mb-[1cm]">

            <div v-if="isComp" class="w-fit">
                <span v-for="(data, index) in data01" :key="index">
                    <p v-if="index === 0" class="mb-[0.5cm] font-bold text-[30px] text-center hidden print:block">{{ new
                        Date(inputTahun1).getFullYear() }}</p>
                    <div v-if="index == 0" class="flex font-bold text-center">
                        <p class="border-2 bg-red-300 border-red-600 p-[10px] w-[3cm]">Bulan</p>
                        <p class="border-2 bg-red-300 border-red-600 border-l-0 p-[10px] w-[4cm]">Pendapatan</p>
                    </div>
                    <div class="flex gap-0 text-left" :class="index % 2 === 0 ? 'bg-gray-100' : ''">
                        <p class="border-2 p-[10px] border-t-0 w-[3cm]">{{ data.Bulan }}</p>
                        <p class="border-2 border-l-0 border-t-0 p-[10px] w-[4cm]">Rp {{ formattedNumber(data.Pendapatan)
                        }}
                        </p>
                    </div>
                </span>
            </div>
            <div v-if="isComp" class="w-fit">
                <span v-for="(data, index) in data02" :key="index">
                    <p v-if="index === 0" class="mb-[0.5cm] font-bold text-[30px] text-center hidden print:block">{{ new
                        Date(inputTahun2).getFullYear() }}</p>
                    <div v-if="index == 0" class="flex font-bold text-center">
                        <p class="border-2 bg-red-300 border-red-600 p-[10px] w-[3cm]">Bulan</p>
                        <p class="border-2 bg-red-300 border-red-600 border-l-0 p-[10px] w-[4cm]">Pendapatan</p>
                    </div>
                    <div class="flex gap-0 text-left" :class="index % 2 === 0 ? 'bg-gray-100' : ''">
                        <p class="border-2 p-[10px] border-t-0 w-[3cm]">{{ data.Bulan }}</p>
                        <p class="border-2 border-l-0 border-t-0 p-[10px] w-[4cm]">Rp {{ formattedNumber(data.Pendapatan)
                        }}
                        </p>
                    </div>
                </span>
            </div>
        </div>
    </div>
    <a-modal v-model:open="isPreview" title="Detail Reservasi" class="text-center" :footer="null">
        <div class="divide-y-[2px]">
            <p class="font-bold"> {{ formattedDate(dataReservasi.start_date) }} - {{ formattedDate(dataReservasi.end_date)
            }}</p>
            <div class="divide-y-[2px] mt-[20px] py-[10px]">
                <img v-if="detailPrev.bukti !== null"
                    :src="`https://dimgrey-giraffe-511443.hostingersite.com/storage/buktis/${detailPrev.bukti}`"
                    class="h-[7cm] mx-auto w-fit" />
                <span class="flex gap-[0.5cm] justify-between">
                    <p class="text-left ">Tipe: {{ detailPrev.tipe }}</p>
                    <p>Total Bayar: Rp {{ formattedNumber(detailPrev.total_bayar) }}</p>
                    <p>Tanggal Bayar: {{ formattedDate(detailPrev.tanggal_bayar) }}</p>
                </span>
                <div>
                    <p class="text-[17px] font-bold mt-[10px]">Data Reservasi</p>
                    <div class="flex flex-col border-2 w-[10cm] mx-auto rounded-md p-[10px] text-left">
                        <span class="flex ">
                            <p class="w-[3cm]">Nama</p>
                            <p> : {{ detailUser.name }}</p>
                        </span>
                        <span class="flex">
                            <p class="w-[3cm]">Nomor Telepon</p>
                            <p> : {{ dataReservasi.nomor_telepon }}</p>
                        </span>
                        <span class="flex">
                            <p class="w-[3cm]">Sisa Pembayaran</p>
                            <p> : Rp {{ formattedNumber(dataReservasi.sisa_pembayaran) }}</p>
                        </span>
                        <span class="flex gap-[0.5cm] mt-[8px]">
                            <span class="border-t-2 border-b-2 w-[5cm] flex flex-col">
                                <p class="font-bold text-center">Jumlah Orang</p>
                                <span class="flex">
                                    <p class="w-[3cm]">Dewasa</p>
                                    <p class="w-[30px]"> : {{ dataReservasi.dewasa }}</p>
                                    <p>Orang</p>
                                </span>
                                <span class="flex">
                                    <p class="w-[3cm]">Anak-Anak</p>
                                    <p class="w-[30px]"> : {{ dataReservasi.anak }}</p>
                                    <p> Orang</p>
                                </span>
                            </span>
                            <span class="w-[3.8cm] mt-[6px] text-center font-bold">
                                <p>STATUS</p>
                                <p :class="dataReservasi.status==='SELESAI' ? 'text-green-600' : 'text-red-600'" class="mt-[10px]">{{ dataReservasi.status }}</p>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </a-modal>
    <a-modal v-model:open="isOpen" title="Bukti Pembayaran" class="text-center" :footer="null">
        <div class="flex flex-col gap-[0.5cm] divide-y-2 rounded-md">
            <img :src="`https://dimgrey-giraffe-511443.hostingersite.com/storage/buktis/${pembayaran.bukti}`"
                class="h-[7cm] w-fit mx-auto rounded-md border-2" />
            <div>
                <p class="font-bold text-[20px]">Konfirmasi Pembayaran</p>
                <a-form :model="form" autocomplete="off" @finish="updatePayment" class="text-start mt-[0.5cm]">
                    <p class="underline underline-offset-2 mb-[5px]">Tipe : {{ pembayaran.tipe }}</p>
                    <div class="flex gap-[0.5cm]">
                        <a-form-item name="idReservasi">
                            <p>ID Pembayaran</p>
                            <a-input v-model:value="pembayaran.id" disabled></a-input>
                        </a-form-item>
                        <a-form-item name="idReservasi">
                            <p>ID Reservasi</p>
                            <a-input v-model:value="dataReservasi.id" disabled></a-input>
                        </a-form-item>
                        <a-form-item name="idReservasi">
                            <div class="flex gap-[10px]">
                                <p>Nomor Telepon</p>
                                <p @click="copyToClipboard(dataReservasi.nomor_telepon)"
                                    class="flex text-red-600 cursor-pointer">
                                    <svg-icon type="mdi" :path="path.mdiContentCopy" class="h-[15px] my-auto" />
                                </p>
                            </div>
                            <a-input v-model:value="dataReservasi.nomor_telepon" disabled></a-input>
                        </a-form-item>
                    </div>
                    <div class="flex justify-between gap-[1cm]">
                        <a-form-item name="totalBayar">
                            <p>Total Bayar</p>
                            <a-input-number v-model:value="form.totalBayar" class="w-full" :min="dp"
                                :max="dataReservasi.total_harga" :controls="false"></a-input-number>
                        </a-form-item>
                        <button type="submit" @click=""
                            class="my-auto border-2 h-fit p-[5px] rounded-md border-blue-500 bg-blue-600 font-bold text-white hover:bg-blue-400">Konfirmasi</button>
                    </div>
                </a-form>
            </div>
        </div>
    </a-modal>
</template>
<script>
import { local } from '../api';

import axios from 'axios';
import Navbar from '../components/template/Navbar.vue'

import SvgIcon from '@jamescoyle/vue-icon'
import { mdiDeleteForeverOutline, mdiContentCopy } from '@mdi/js'
import { ref } from 'vue';

import moment from 'moment';

import * as XLSX from 'xlsx'
import { message } from 'ant-design-vue';

export default {
    data() {
        return {
            reservasi: [],
            totalData: {},
            total: 0,
            tahun: ref(),
            tahunPertama: ref(),
            tahunKedua: ref(),
            inputTahun: new Date(),
            inputTahun1: null,
            inputTahun2: null,
            searchQuery: '',
            columns: [
                { title: 'No' },
                { title: 'Nama', dataIndex: 'nama' },
                { title: 'Nomor Telepon', dataIndex: 'nomor_telepon' },
                { title: 'Check In', dataIndex: 'start_date' },
                { title: 'Check Out', dataIndex: 'end_date' },
                { title: 'Total Harga', dataIndex: 'total_harga' },
                { title: 'Kekurangan', dataIndex: 'sisa_pembayaran' },
                { title: 'Status', dataIndex: 'status' },
                { title: 'Aksi' }
            ],
            path: {
                mdiDeleteForeverOutline, mdiContentCopy
            },
            current: ref(1),
            pendapatan: [],
            pembanding1: [],
            pembanding2: [],
            isComp: false,
            pembayaran: {},
            dp: 0,
            dataReservasi: {},
            isOpen: ref(false),
            form: {
                totalBayar: 0,
            },
            options: {
                chart: {
                    id: 'pendapatan-villa',
                    type: 'area',
                },
                stroke: {
                    width: 2,
                    curve: 'smooth'
                },
                markers: {
                    size: 4,
                    colors: ["#ff1515"],
                    strokeColor: "#00BAEC",
                    strokeWidth: 2
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
                },
                noData: {
                    text: 'No Data'
                }
            },
            dataPdf: [],
            data01: [],
            data02: [],
            isPreview: ref(false),
            detailPrev: {},
            detailUser: {}
        }
    },
    watch: {
        tahun(newDates) {
            if (newDates) {
                this.inputTahun = newDates.format('YYYY-MM-DD')
            }
        },
        tahunPertama(newDates) {
            if (newDates) {
                this.inputTahun1 = newDates.format('YYYY-MM-DD')
            }
        },
        tahunKedua(newDates) {
            if (newDates) {
                this.inputTahun2 = newDates.format('YYYY-MM-DD')
            }
        }
    },
    mounted() {
        this.getReservasi()
        this.getLaporanBulanan()
    },
    computed: {
        filteredReservasi() {

            if (!this.searchQuery) {
                return this.reservasi
            }
            return this.reservasi.filter(data => {
                const searchLower = this.searchQuery.toLowerCase();
                return data.nama.toLowerCase().includes(searchLower) || data.nomor_telepon.toLowerCase().includes(searchLower) || data.status.toLowerCase().includes(searchLower)
            })
        },
        yearChange() {
            this.getReservasi()
            this.getLaporanBulanan()
        },
        yearCompareChange() {
            this.getCompare(new Date(this.inputTahun1).getFullYear(), 'pembanding1', 'data01')
            this.getCompare(new Date(this.inputTahun2).getFullYear(), 'pembanding2', 'data02')
        },
        comparedData() {
            return [this.pembanding1, this.pembanding2]
        }
    },
    methods: {
        async getReservasi() {
            const tahun = new Date(this.inputTahun).getFullYear()
            await axios.get(local + `reservasi/${tahun}?page=${this.current}`, {
                headers: {
                    Accept: 'application/json',
                }
            })
                .then(res => {
                    this.reservasi = res.data.data.data
                    this.totalData = res.data.data
                    this.total = this.totalData.last_page * this.totalData.per_page
                    message.success('Data Berhasil Diambil!', 2);
                })
                .catch((error) => {
                    console.error(error.response)
                })
        },
        async getReservasiByID(id) {
            await axios.get(local + `reservasi-id/${id}`, {
                headers: 'application/json'
            })
                .then(res => {
                    this.dataReservasi = res.data.data
                    this.form.totalBayar = this.dataReservasi.total_harga / 2
                    this.dp = this.dataReservasi.total_harga / 2
                })
        },
        async updatePayment() {
            const loadingMessage = message.loading('Mengkonfirmasi...', 0)
            const id = this.pembayaran.id
            const idUser = this.pembayaran.id_user
            const idReservasi = this.pembayaran.id_reservasi
            await axios.put(local + `update-payment/${id}?total_bayar=${this.form.totalBayar}&id_user=${idUser}&id_reservasi=${idReservasi}`, {}, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    loadingMessage()
                    window.location.reload()
                    message.success(res.data.message, 2)
                })
                .catch((error) => {
                    console.error(error.response)
                })
        },
        async getLaporanBulanan() {
            const tahun = new Date(this.inputTahun).getFullYear()

            await axios.get(local + `laporan/${tahun}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    const pendapatanBulanan = res.data;

                    const seriesData = new Array(12).fill(0);

                    if (Array.isArray(pendapatanBulanan)) {
                        pendapatanBulanan.forEach(item => {
                            const monthIndex = item.month - 1; // Bulan di array dimulai dari 0 (Januari) sampai 11 (Desember)
                            seriesData[monthIndex] = item.total_harga;
                        });

                        this.pendapatan = [{ name: 'Pendapatan', data: seriesData }];

                        const data = this.pendapatan[0].data.map((value, index) => ({
                            Bulan: this.options.xaxis.categories[index],
                            Pendapatan: value
                        }));

                        this.dataPdf = data

                    } else {
                        console.error('Unexpected response format:', pendapatanBulanan);
                    }
                })
        },
        async getCompare(year, stateProp, stateProp2) {
            await axios.get(local + `laporan/${year}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    const pendapatanBulanan = res.data
                    const seriesData = new Array(12).fill(0)

                    if (Array.isArray(pendapatanBulanan)) {
                        pendapatanBulanan.forEach(item => {
                            const monthIndex = item.month - 1
                            seriesData[monthIndex] = item.total_harga
                        })
                        this[stateProp] = { name: `Pendapatan ${year}`, data: seriesData }

                        const data = seriesData.map((value, index) => ({
                            Bulan: this.options.xaxis.categories[index],
                            Pendapatan: value
                        }));

                        this[stateProp2] = data

                    } else {
                        console.error('Unexpected response format: ', pendapatanBulanan)
                    }
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                })
        },
        async buktiPembayaran(idReservasi) {
            const id = idReservasi
            const loadingMessage = message.loading('Menampilkan Bukti Bayar...', 0)
            await axios.get(local + `payment/${id}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    loadingMessage()
                    this.pembayaran = res.data.data
                    this.getReservasiByID(id)
                    this.isOpen = true
                    message.success(res.data.message, 2)
                })
        },
        async cancelReservasi(idReservasi) {
            const id = idReservasi
            const loadingMessage = message.loading('Membatalkan...', 0)
            await axios.put(local + `reservasi-cancel/${id}`, {}, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    loadingMessage()
                    message.success(res.data.message, 2)
                    this.getReservasi()

                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                })
        },
        async deleteReservasi(id) {
            const loadingMessage = message.loading('Menghapus Reservasi...', 0)
            await axios.delete(local + `delete-reservasi/${id}`)
                .then(res => {
                    loadingMessage()
                    this.getReservasi()
                    message.success(res.data.message, 2)
                })
                .catch((error) => {
                    loadingMessage()
                    console.error(error.response)
                    message.error(error.response.data.message)
                })
        },
        async preview(id) {
            await axios.get(local + `payment/${id}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    this.isPreview = true
                    this.detailPrev = res.data.data
                    this.getUser(this.detailPrev.id_user)
                    this.getReservasiByID(this.detailPrev.id_reservasi)
                })
        },
        async getUser(id) {
            await axios.get(local + `users/${id}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res)
                    this.detailUser = res.data.data
                })
        },
        exportToExcel() {
            const data = this.pendapatan[0].data.map((value, index) => ({
                Bulan: this.options.xaxis.categories[index],
                Pendapatan: value
            }));

            const worksheet = XLSX.utils.json_to_sheet([]);

            XLSX.utils.sheet_add_aoa(worksheet, [
                ['Villa Watusaman'],
                [`Pendapatan ${new Date(this.inputTahun).getFullYear()}`],
            ], { origin: 'A1' })

            worksheet['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, // Merge cells for "Villa Watusaman"
                { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } }, // Merge cells for "Pendapatan [Year]"
            ];

            XLSX.utils.sheet_add_json(worksheet, data, { origin: 'A4' })


            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Pendapatan');

            const maxWidths = data.reduce((acc, curr) => {
                Object.keys(curr).forEach((key, i) => {
                    const valueLength = curr[key].toString().length;
                    acc[i] = acc[i] ? Math.max(acc[i], valueLength) : valueLength;
                });
                return acc;
            }, []);

            // Set the column widths in the worksheet
            worksheet['!cols'] = maxWidths.map(width => ({ wch: width }));

            // Adjust the header widths to be at least as wide as the header names
            Object.keys(data[0]).forEach((key, i) => {
                worksheet['!cols'][i].wch = Math.max(worksheet['!cols'][i].wch, key.length);
            });

            XLSX.writeFile(workbook, 'pendapatan-villa.xlsx');
        },
        exportCompareToExcel() {
            const data1 = this.pembanding1.data.map((value, index) => ({
                Bulan: this.options.xaxis.categories[index],
                Pendapatan: value
            }));

            const data2 = this.pembanding2.data.map((value, index) => ({
                Bulan: this.options.xaxis.categories[index],
                Pendapatan: value
            }));

            const worksheet = XLSX.utils.json_to_sheet([]);

            XLSX.utils.sheet_add_aoa(worksheet, [
                [`Villa Watusaman Compared ${new Date(this.inputTahun1).getFullYear()} - ${new Date(this.inputTahun2).getFullYear()}`],
                [],
            ], { origin: 'A1' })
            XLSX.utils.sheet_add_aoa(worksheet, [
                [`${new Date(this.inputTahun1).getFullYear()}`]
            ], { origin: 'A3' })
            XLSX.utils.sheet_add_aoa(worksheet, [
                [`${new Date(this.inputTahun2).getFullYear()}`]
            ], { origin: 'D3' })

            worksheet['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // Merge cells for "Villa Watusaman"
                { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
                { s: { r: 2, c: 3 }, e: { r: 2, c: 4 } },
            ];

            XLSX.utils.sheet_add_json(worksheet, data1, { origin: 'A4' })
            XLSX.utils.sheet_add_json(worksheet, data2, { origin: 'D4' })


            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Pendapatan');

            const maxWidths = data1.reduce((acc, curr) => {
                Object.keys(curr).forEach((key, i) => {
                    const valueLength = curr[key].toString().length;
                    acc[i] = acc[i] ? Math.max(acc[i], valueLength) : valueLength;
                });
                return acc;
            }, []);

            data2.forEach((curr, index) => {
                Object.keys(curr).forEach((key, i) => {
                    const valueLength = curr[key].toString().length;
                    maxWidths[i + 3] = maxWidths[i + 3] ? Math.max(maxWidths[i + 3], valueLength) : valueLength;
                });
            });
            // Set the column widths in the worksheet
            worksheet['!cols'] = maxWidths.map(width => ({ wch: width }));

            // Adjust the header widths to be at least as wide as the header names
            Object.keys(data1[0]).forEach((key, i) => {
                worksheet['!cols'][i].wch = Math.max(worksheet['!cols'][i].wch, key.length);
            });
            Object.keys(data2[0]).forEach((key, i) => {
                worksheet['!cols'][i + 3].wch = Math.max(worksheet['!cols'][i + 3].wch, key.length);
            });

            XLSX.writeFile(workbook, 'pendapatan-villa.xlsx');
        },
        formattedDate(time) {
            return moment(time).format('DD MMM YYYY')
        },
        formattedNumber(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        exportToPdf() {
            window.print()
        },
        formattedNumber(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                message.success('Berhasil Dicopy Ke Clipboard!', 2)
            }).catch(err => {
                console.error("Failed to copy text: ", err);
            });
        },
        currentChange() {
            this.getReservasi()
        },
        formattedDate(time) {
            return moment(time).format('DD MMM YYYY')
        },
        formattedNumber(number) {
            if (typeof number !== 'number') {
                return '0'
            }
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
    },
    components: {
        Navbar,
        SvgIcon
    }
}
</script>