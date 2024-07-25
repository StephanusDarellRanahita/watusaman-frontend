<template>
    <Navbar></Navbar>
    <div class="absolute mt-[3cm] w-full">
        <div class="flex flex-col mx-auto w-fit gap-[0.5cm]">
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
                            <div v-if="body.title === 'Action'" class="flex mx-auto w-fit gap-[5px]">
                                <button @click="cancelReservasi(data.id)" class="text-red-600 border-2 border-red-600 rounded md p-[4px] hover:bg-red-200">Batal</button>
                                <button @click="deleteReservasi(data.id)"><svg-icon type="mdi"
                                        :path="path.mdiDeleteForeverOutline"></svg-icon></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <a-pagination v-model:current="current" show-quick-jumper :total="total" :page-size="totalData.per_page"
            @change="currentChange" class="ml-[19cm] mt-[0.5cm]" />
        <div v-if="isComp" class="mx-auto w-fit mt-[1cm] rounded-md flex gap-[1cm]">
            <a-date-picker v-model:value="tahunPertama" picker="year" placeholder="Tahun Pertama" class="border-black"
                @change="yearCompareChange"></a-date-picker>
            <a-date-picker v-model:value="tahunKedua" picker="year" placeholder="Tahun Kedua" class="border-black"
                @change="yearCompareChange"></a-date-picker>
        </div>
        <div class="flex justify-center">
            <div class="my-auto -rotate-90 -ml-[4.5cm] w-fit h-fit">
                <p class="text-[40px] font-bold bg-clip-text text-transparent bg-gradient-to-tr from-blue-400 to-green-400">GRAFIK PENDAPATAN</p>
            </div>
            <div class="border-2 w-fit mt-[1cm] flex gap-[1cm] mb-[1cm] -ml-[4.75cm]">
                <apexchart v-if="!isComp" width="700" :options="options" :series="pendapatan"
                    class="mx-auto my-auto bg-white rounded-md">
                </apexchart>
                <apexchart v-if="isComp" width="700" :options="options" :series="comparedData"
                    class="mx-auto my-auto bg-white rounded-md">
                </apexchart>
                <div class="border p-[5px]">
                    <p class="font-mono text-[15px] text-center">Ekspor Excel: </p>
                    <button v-if="!isComp" @click="exportToExcel"
                        class="text-black border-[2px] border-green-600 h-fit mx-[17px] mt-[3px] rounded p-[5px] ">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-green-600 w-[1cm]">
                            <path
                                d="M21.17 3.25Q21.5 3.25 21.76 3.5 22 3.74 22 4.08V19.92Q22 20.26 21.76 20.5 21.5 20.75 21.17 20.75H7.83Q7.5 20.75 7.24 20.5 7 20.26 7 19.92V17H2.83Q2.5 17 2.24 16.76 2 16.5 2 16.17V7.83Q2 7.5 2.24 7.24 2.5 7 2.83 7H7V4.08Q7 3.74 7.24 3.5 7.5 3.25 7.83 3.25M7 13.06L8.18 15.28H9.97L8 12.06L9.93 8.89H8.22L7.13 10.9L7.09 10.96L7.06 11.03Q6.8 10.5 6.5 9.96 6.25 9.43 5.97 8.89H4.16L6.05 12.08L4 15.28H5.78M13.88 19.5V17H8.25V19.5M13.88 15.75V12.63H12V15.75M13.88 11.38V8.25H12V11.38M13.88 7V4.5H8.25V7M20.75 19.5V17H15.13V19.5M20.75 15.75V12.63H15.13V15.75M20.75 11.38V8.25H15.13V11.38M20.75 7V4.5H15.13V7Z" />
                        </svg>
                    </button>
                    <button v-if="isComp" @click="exportCompareToExcel"
                        class="text-black border-[2px] border-green-600 h-fit mx-[17px] mt-[3px] rounded p-[5px] ">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-green-600 w-[1cm]">
                            <path
                                d="M21.17 3.25Q21.5 3.25 21.76 3.5 22 3.74 22 4.08V19.92Q22 20.26 21.76 20.5 21.5 20.75 21.17 20.75H7.83Q7.5 20.75 7.24 20.5 7 20.26 7 19.92V17H2.83Q2.5 17 2.24 16.76 2 16.5 2 16.17V7.83Q2 7.5 2.24 7.24 2.5 7 2.83 7H7V4.08Q7 3.74 7.24 3.5 7.5 3.25 7.83 3.25M7 13.06L8.18 15.28H9.97L8 12.06L9.93 8.89H8.22L7.13 10.9L7.09 10.96L7.06 11.03Q6.8 10.5 6.5 9.96 6.25 9.43 5.97 8.89H4.16L6.05 12.08L4 15.28H5.78M13.88 19.5V17H8.25V19.5M13.88 15.75V12.63H12V15.75M13.88 11.38V8.25H12V11.38M13.88 7V4.5H8.25V7M20.75 19.5V17H15.13V19.5M20.75 15.75V12.63H15.13V15.75M20.75 11.38V8.25H15.13V11.38M20.75 7V4.5H15.13V7Z" />
                        </svg>
                    </button>
                    <div class="text-center">
                        <p class="mt-[1cm]">Perbandingan</p>
                        <a-switch v-model:checked="isComp"></a-switch>
                    </div>
                </div>
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
import { mdiDeleteForeverOutline } from '@mdi/js'
import { ref } from 'vue';

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
                { title: 'Action' }
            ],
            path: {
                mdiDeleteForeverOutline
            },
            current: ref(1),
            pendapatan: [],
            pembanding1: [],
            pembanding2: [],
            isComp: false,
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
        }
    },
    watch: {
        tahun(newDates) {
            if (newDates) {
                this.inputTahun = newDates.format('YYYY-MM-DD')
                console.log('TAHUN FORMAT: ', this.inputTahun)
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
            this.getCompare(new Date(this.inputTahun1).getFullYear(), 'pembanding1')
            this.getCompare(new Date(this.inputTahun2).getFullYear(), 'pembanding2')
        },
        comparedData() {
            console.log('COMPARE', this.compare)
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
                    } else {
                        console.error('Unexpected response format:', pendapatanBulanan);
                    }
                })
        },
        async getCompare(year, stateProp) {
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
                    } else {
                        console.error('Unexpected response format: ', pendapatanBulanan)
                    }
                })
        },
        async cancelReservasi(idReservasi) {
            const id = idReservasi
            const loadingMessage = message.loading('Membatalkan...',0)
            await axios.put(local + `reservasi-cancel/${id}`, {}, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    loadingMessage()
                    console.log(res)
                    message.success(res.data.message,2)
                    
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                })
        },
        async deleteReservasi(id) {
            await axios.delete(local + `delete-reservasi/${id}`)
                .then(res => {
                    this.getReservasi()
                })
                .catch((error) => {
                    console.error(error.response)
                })
        },
        exportToExcel() {
            console.log('[PEMBANDING]', this.pembanding1)
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
            console.log('[PEMBANDING]', this.pembanding1)
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