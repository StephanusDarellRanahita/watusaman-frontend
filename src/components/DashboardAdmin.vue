<template>
    <Navbar></Navbar>
    <div class="absolute mt-[3cm] w-full">
        <div class="flex flex-col mx-auto w-fit gap-[0.5cm]">
            <div class="flex justify-between">
                <a-input v-model:value="searchQuery" class="w-fit" placeholder="search..."></a-input>
                <p class="mt-auto font-bold text-[20px]">DAFTAR RESERVASI</p>
            </div>
            <table class="order-2">
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
                            <div v-if="body.title === 'Action'" class="mx-auto w-fit">
                                <button @click="deleteReservasi(data.id)"><svg-icon type="mdi"
                                        :path="path.mdiDeleteForeverOutline"></svg-icon></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <a-pagination v-model:current="current" show-quick-jumper :total="total" :page-size="totalData.per_page"
            @change="currentChange" class="ml-[7.7cm] mt-[0.5cm]" />
        <div class="mx-auto border-2 w-fit mt-[1cm] flex gap-[1cm] mb-[1cm]">
            <apexchart width="700" :options="options" :series="pendapatan" class="mx-auto my-auto bg-white rounded-md">
            </apexchart>
            <div class="border p-[5px]">
                <p class="font-mono text-[15px] text-center">Export to: </p>
                <button @click="exportToExcel"
                    class="text-black border-[2px] border-green-600 h-fit mx-[17px] mt-[3px] rounded p-[5px] ">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-green-600 w-[1cm]">
                        <path
                            d="M21.17 3.25Q21.5 3.25 21.76 3.5 22 3.74 22 4.08V19.92Q22 20.26 21.76 20.5 21.5 20.75 21.17 20.75H7.83Q7.5 20.75 7.24 20.5 7 20.26 7 19.92V17H2.83Q2.5 17 2.24 16.76 2 16.5 2 16.17V7.83Q2 7.5 2.24 7.24 2.5 7 2.83 7H7V4.08Q7 3.74 7.24 3.5 7.5 3.25 7.83 3.25M7 13.06L8.18 15.28H9.97L8 12.06L9.93 8.89H8.22L7.13 10.9L7.09 10.96L7.06 11.03Q6.8 10.5 6.5 9.96 6.25 9.43 5.97 8.89H4.16L6.05 12.08L4 15.28H5.78M13.88 19.5V17H8.25V19.5M13.88 15.75V12.63H12V15.75M13.88 11.38V8.25H12V11.38M13.88 7V4.5H8.25V7M20.75 19.5V17H15.13V19.5M20.75 15.75V12.63H15.13V15.75M20.75 11.38V8.25H15.13V11.38M20.75 7V4.5H15.13V7Z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import { local } from '../api';

import axios from 'axios';
import Navbar from '../components/template/Navbar.vue'
import moment from 'moment';

import SvgIcon from '@jamescoyle/vue-icon'
import { mdiDeleteForeverOutline, mdiServerMinus } from '@mdi/js'
import { ref } from 'vue';

import * as XLSX from 'xlsx'

export default {
    data() {
        return {
            reservasi: [],
            totalData: {},
            total: 0,
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
                { title: 'Action' }
            ],
            path: {
                mdiDeleteForeverOutline
            },
            current: ref(1),
            pendapatan: [],
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
                    colors: ["#ffffff"],
                    strokeColor: "#00BAEC",
                    strokeWidth: 2
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des']
                },
                noData: {
                    text: 'loading...'
                }
            },
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
                return data.nama.toLowerCase().includes(searchLower) || data.nomor_telepon.toLowerCase().includes(searchLower)
            })
        }
    },
    methods: {
        async getReservasi() {
            await axios.get(local + `reservasi?page=${this.current}`, {
                headers: {
                    Accept: 'application/json',
                }
            })
                .then(res => {
                    console.log(res)
                    this.reservasi = res.data.data.data
                    this.totalData = res.data.data
                    this.total = this.totalData.last_page * this.totalData.per_page
                    for (let i = 0; i < this.reservasi.length; i++) {
                        console.log(i)
                        const createdAt = new Date(this.reservasi[i].created_at).getTime()
                        const now = new Date().getTime()
                        const duration = Math.floor((createdAt + 24 * 60 * 60 * 1000 - now) / 1000)
                        const id = res.data.data.data[i].id
                        if (duration <= 0) {
                            this.statusCancel(id)
                        } else {
                            console.log('Nothing')
                        }
                    }
                    console.log('RESER', this.reservasi)
                })
                .catch((error) => {
                    console.error(error.response)
                })
        },
        async statusCancel() {
            const id = localStorage.getItem('idUser')
            await axios.put(local + `update-status/${id}`, {
                from_status: 'PEMBAYARAN',
                to_status: 'CANCEL'
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(async (res) => {
                    console.log(res)
                    // window.location.reload()
                })
                .catch(async (error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                })
        },
        async getLaporanBulanan() {
            await axios.get(local + 'laporan', {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res)
                    const pendapatanBulanan = res.data;

                    const seriesData = new Array(12).fill(0);

                    if (Array.isArray(pendapatanBulanan)) {
                        pendapatanBulanan.forEach(item => {
                            const monthIndex = item.month - 1; // Bulan di array dimulai dari 0 (Januari) sampai 11 (Desember)
                            seriesData[monthIndex] = item.total_harga;
                        });

                        this.pendapatan = [{ name: 'Pendapatan', data: seriesData }];
                    } else {
                        console.error('Unexpected response format:', pendapatanBulanan);
                    }
                })
        },
        async deleteReservasi(id) {
            await axios.delete(local + `delete-reservasi/${id}`)
                .then(res => {
                    console.log(res)
                    this.getReservasi()
                })
                .catch((error) => {
                    console.error(error.response)
                })
        },
        exportToExcel() {
            const data = this.pendapatan[0].data.map((value, index) => ({
                Month: this.options.xaxis.categories[index],
                Pendapatan: value
            }));
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Pendapatan');
            XLSX.writeFile(workbook, 'pendapatan-villa.xlsx');
        },
        currentChange() {
            this.getReservasi()
            console.log('CURRENT PAGE', this.current)
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