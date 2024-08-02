<style scoped>
.transition-hover {
    height: 2.5cm;
    transition: height 0.5s ease;
    overflow: hidden;
    /* Ensure overflow is hidden */
}

.transition-hover:hover {
    height: 8cm;
    /* Change height on hover */
}
</style>
<template>
    <Navbar class="print:hidden"></Navbar>
    <!-- <img class="absolute -z50" src="/watusaman.jpg" /> -->
    <div class="flex flex-col gap-[1cm] w-[17.5cm] lg:w-screen mb-[1cm]">
        <div class="text-center text-black px-[1cm] py-[3cm] h-fit print:hidden flex flex-col lg:flex-row">
            <div>
                <div>
                    <p class="font-bold text-[30px]">Selamat Datang Di Villa Watusaman</p>
                    <p>Villa Watusaman, Gallery & Resto Bakmijawa</p>
                    <p>Ringroad Selatan Jl. Parangtritis km 4.5 Dusun Saman 1. No 98. Rt 11. Sewon Bantul</p>
                    <p>Daerah Istimewa Yogyakarta</p>
                    <div class="flex gap-[0.5cm] justify-center">
                        <button @click="scrollToReservasi"
                            class="mt-[2cm] border-2 border-red-600 p-[0.4cm] text-red-600 font-bold text-[20px] hover:text-[25px] hover:bg-red-400 hover:text-white rounded-xl hover:p-[0.25cm] transition-all hover:ease-in ease-out duration-200 ">Reservasi</button>
                        <button @click="profil"
                            class="mt-[2cm] border-2 border-black p-[0.4cm] font-bold text-[20px] hover:bg-black hover:text-white hover:p-[0.25cm] transition-all ease-in-out duration-200 hover:text-[25px] rounded-xl ">Profil</button>
                    </div>
                    <p class="mt-[1cm] text-[20px]">Selamat Datang, <h class="italic font-semibold">{{ user.name }}</h>
                    </p>
                    <div class="mt-[2cm] flex flex-col gap-[0.5cm]">
                        <div v-if="loading" class="border w-[9cm] mx-auto rounded-md p-[0.3cm] h-[2.5cm] animate-pulse">
                            <div class="border h-[10px] rounded-md bg-gray-100"></div>
                            <div class="border h-[10px] w-[4cm] mx-auto rounded-md bg-gray-100 mt-[0.3cm]"></div>
                        </div>
                        <div v-if="loading" class="border w-[9cm] mx-auto rounded-md p-[0.3cm] h-[2.5cm] animate-pulse">
                            <div class="border h-[10px] rounded-md bg-gray-100"></div>
                            <div class="border h-[10px] w-[4cm] mx-auto rounded-md bg-gray-100 mt-[0.3cm]"></div>
                        </div>
                        <div :class="!loading ? '' : 'hidden'" class="flex flex-col justify-between">
                            <p class="font-bold text-[25px]">DAFTAR RESERVASI</p>
                            <div
                                class="grid grid-cols-2 w-fit gap-[0.5cm] mx-auto border-t-2 border-red-600 border-b-2 rounded-md py-[10px] h-[7cm] overflow-auto">
                                <div v-for="(data, index) in reservasis" :key="index"
                                    class="flex flex-col w-[7cm] lg:w-[9cm] mx border-2 gap-[0.1cm] p-[0.3cm] rounded-md border-red-600 transition-hover">
                                    <p>{{ data.nama }} [ {{ formattedDate(data.start_date) }} - {{
                                        formattedDate(data.end_date)
                                    }} ]
                                    </p>
                                    <p v-if="data.sisa_pembayaran == 0 && data.status == 'SELESAI'"
                                        class="mb-[0.3cm] font-bold text-green-500">Status [ LUNAS ]</p>
                                    <p v-else-if="data.sisa_pembayaran != 0 && data.status == 'SELESAI'"
                                        class="mb-[0.3cm] font-bold text-yellow-400">Status [ DP ]</p>
                                    <p v-else
                                        :class="data.status == 'PEMBAYARAN' ? ['text-red-600', 'font-bold'] : ['text-red-400', 'font-bold']"
                                        class="mb-[0.3cm] font-bold text-green-500">Status [ {{ data.status }} ]</p>
                                    <p>-------------------------------------</p>
                                    <div class="text-left">
                                        <p class="text-center">{{ data.nomor_telepon }}</p>
                                        <p>Dewasa <a class="ml-[1cm]">:</a> {{ data.dewasa }}</p>
                                        <p>Anak <a class="ml-[1.5cm]">:</a> {{ data.anak }}</p>
                                        <p>Total <a class="ml-[1.54cm]">:</a> Rp {{ formattedNumber(data.total_harga) }}
                                        </p>
                                        <p>Kekurangan <a class="ml-[0.21cm]">:</a> Rp {{
                                            formattedNumber(data.sisa_pembayaran)
                                        }}
                                        </p>
                                    </div>
                                    <div class="mx-auto w-fit mb-[1cm] flex gap-[0.5cm]">
                                        <button
                                            :class="data.status == 'BATAL' ? ['hidden'] : ['border-red-600', 'hover:bg-red-400']"
                                            class="border-2  rounded-md p-[4px] text-red-600 hover:text-white hover:font-bold"
                                            @click="cetak(data.id)">Cetak</button>
                                        <button
                                            :class="data.status == 'BATAL' ? ['hidden'] : harimindua(data.start_date) ? ['border-gray-500', 'bg-gray-300', 'text-gray-500', 'cursor-not-allowed'] : ['border-red-600', 'hover:bg-red-400', 'bg-red-600', 'text-white']"
                                            class="font-boldp-[4px] rounded-md p-[4px] border-2" @click="cancel(data.id)">
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mx-auto">
                <p class="font-bold text-[25px] text-center mb-[0.5cm]">KAMAR</p>
                <div v-if="loading" class="flex gap-[0.4cm] animate-pulse">
                    <div class="flex flex-col w-[6cm]">
                        <div class="w-[6cm] border-2 rounded-xl items-center pb-[0.5cm] py-[0.1cm] ">
                            <a-skeleton-image />
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                        </div>
                    </div>
                    <div class="flex flex-col w-[6cm]">
                        <div class="w-[6cm] border-2 rounded-xl items-center pb-[0.5cm] py-[0.1cm] ">
                            <a-skeleton-image />
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                        </div>
                    </div>
                    <div class="flex flex-col w-[6cm]">
                        <div class="w-[6cm] border-2 rounded-xl items-center pb-[0.5cm] py-[0.1cm] ">
                            <a-skeleton-image />
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                            <div class="border h-[10px] rounded-md bg-gray-100 my-[0.2cm] w-[4cm] mx-auto"></div>
                        </div>
                    </div>
                </div>
                <div v-if="!loading"
                    class="flex overflow-x-scroll mx-auto gap-[0.4cm] w-[14.5cm] lg:w-[19cm] snap-x snap-mandatory border-red-600 border-t-2 border-b-2 rounded-md">
                    <div class="min-w-[6cm] border-2 border-red-600 rounded-xl flex flex-col items-center font-thin pb-[0.5cm] snap-center snap-always mt-[0.5cm]"
                        v-for="(data, index) in image" :key="index">
                        <img :src="data.image" class="h-[4cm] p-[0.1cm] rounded-t-xl" />
                        <p class="grid grid-cols-2 w-[3cm]"><svg-icon type="mdi" :path="path.mdiDoor"
                                class="h-[0.5cm] my-auto" />
                        <p class="text-left">{{ data.nomor_kamar }}</p>
                        </p>
                        <p class="grid grid-cols-2 w-[3cm]"><svg-icon type="mdi" :path="path.mdiAccountMinus"
                                class="h-[0.5cm] my-auto" />
                        <p class="text-left">{{ data.min_pax }} Pax</p>
                        </p>
                        <p class="grid grid-cols-2 w-[3cm]"><svg-icon type="mdi" :path="path.mdiAccountMultiplePlus"
                                class="h-[0.5cm] my-auto" />
                        <p class="text-left">{{ data.max_pax }} Pax</p>
                        </p>
                        <p class="grid grid-cols-2 w-[3cm]"><svg-icon type="mdi" :path="path.mdiBedEmpty"
                                class="h-[0.5cm] my-auto" />
                        <p class="font-bold text-left uppercase">{{ data.tipe }}</p>
                        </p>
                    </div>
                    <div class="min-w-[6cm] border-2 border-red-600 rounded-xl flex flex-col items-center font-thin pb-[0.5cm] snap-center snap-always mt-[0.5cm]"
                        v-for="(data, index) in image" :key="index">
                        <img :src="data.image" class="h-[4cm] p-[0.1cm] rounded-t-xl" />
                        <p class="grid grid-cols-2 w-[3cm]"><svg-icon type="mdi" :path="path.mdiDoor"
                                class="h-[0.5cm] my-auto" />
                        <p class="text-left">{{ data.nomor_kamar }}</p>
                        </p>
                        <p class="grid grid-cols-2 w-[3cm]"><svg-icon type="mdi" :path="path.mdiAccountMinus"
                                class="h-[0.5cm] my-auto" />
                        <p class="text-left">{{ data.min_pax }} Pax</p>
                        </p>
                        <p class="grid grid-cols-2 w-[3cm]"><svg-icon type="mdi" :path="path.mdiAccountMultiplePlus"
                                class="h-[0.5cm] my-auto" />
                        <p class="text-left">{{ data.max_pax }} Pax</p>
                        </p>
                        <p class="grid grid-cols-2 w-[3cm]"><svg-icon type="mdi" :path="path.mdiBedEmpty"
                                class="h-[0.5cm] my-auto" />
                        <p class="font-bold text-left uppercase">{{ data.tipe }}</p>
                        </p>
                    </div>
                </div>
                <div class="lg:ml-[1.1cm] mt-[1.3cm]">
                    <img src="/watusaman.jpg" class="h-[8cm] rounded-md" />
                </div>
            </div>
        </div>
        <div class="text-center print:hidden">
            <Review />
        </div>
        <div id="info-section" class="mt-[2cm] h-[10cm] w-full lg:w-screen print:hidden">
            <div class="h-[6cm] bg-gradient-to-r from-red-600 from-50% to-white text-white font-bold p-[10px]">
                <div>
                    <p class="text-[20px]">Fasilitas Villa Watusaman</p>
                    <div class="h-[3px] bg-gradient-to-r from-white from-50% to-red-600"></div>
                </div>
                <div class="flex lg:gap-[3cm] gap-[20px] mt-[20px] text-[15px] lg:text-[18px]">
                    <div class="flex flex-col gap-[10px]">
                        <div class="flex gap-[10px]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                class="h-[20px] fill-white outline rounded">
                                <title>account-group</title>
                                <path
                                    d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
                            </svg>
                            <p>Area Publik</p>
                        </div>
                        <div class="flex gap-[10px]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                class="h-[20px] fill-white outline rounded">
                                <title>wifi</title>
                                <path
                                    d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z" />
                            </svg>
                            <p>Wifi</p>
                        </div>
                        <div class="flex gap-[10px]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                class="h-[20px] fill-white outline rounded">
                                <title>pool</title>
                                <path
                                    d="M2,15C3.67,14.25 5.33,13.5 7,13.17V5A3,3 0 0,1 10,2C11.31,2 12.42,2.83 12.83,4H10A1,1 0 0,0 9,5V6H14V5A3,3 0 0,1 17,2C18.31,2 19.42,2.83 19.83,4H17A1,1 0 0,0 16,5V14.94C18,14.62 20,13 22,13V15C19.78,15 17.56,17 15.33,17C13.11,17 10.89,15 8.67,15C6.44,15 4.22,16 2,17V15M14,8H9V10H14V8M14,12H9V13C10.67,13.16 12.33,14.31 14,14.79V12M2,19C4.22,18 6.44,17 8.67,17C10.89,17 13.11,19 15.33,19C17.56,19 19.78,17 22,17V19C19.78,19 17.56,21 15.33,21C13.11,21 10.89,19 8.67,19C6.44,19 4.22,20 2,21V19Z" />
                            </svg>
                            <p>Kolam Renang</p>
                        </div>
                        <div class="flex gap-[10px]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                class="h-[20px] fill-white outline rounded">
                                <title>countertop-outline</title>
                                <path
                                    d="M22 10H18V7C18 5.34 16.66 4 15 4S12 5.34 12 7H14C14 6.45 14.45 6 15 6S16 6.45 16 7V10H8C9.1 10 10 9.1 10 8V4H4V8C4 9.1 4.9 10 6 10H2V12H4V20H20V12H22V10M6 6H8V8H6V6M6 18V12H11V18H6M18 18H13V12H18V18Z" />
                            </svg>
                            <p>Dapur</p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-[10px]">
                        <div class="flex gap-[10px]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                class="h-[20px] fill-white outline rounded">
                                <title>shower-head</title>
                                <path
                                    d="M20,20A1,1 0 0,1 21,21A1,1 0 0,1 20,22A1,1 0 0,1 19,21A1,1 0 0,1 20,20M16,20A1,1 0 0,1 17,21A1,1 0 0,1 16,22A1,1 0 0,1 15,21A1,1 0 0,1 16,20M12,20A1,1 0 0,1 13,21A1,1 0 0,1 12,22A1,1 0 0,1 11,21A1,1 0 0,1 12,20M8,20A1,1 0 0,1 9,21A1,1 0 0,1 8,22A1,1 0 0,1 7,21A1,1 0 0,1 8,20M4,20A1,1 0 0,1 5,21A1,1 0 0,1 4,22A1,1 0 0,1 3,21A1,1 0 0,1 4,20M6,17A1,1 0 0,1 7,18A1,1 0 0,1 6,19H6A1,1 0 0,1 5,18A1,1 0 0,1 6,17H6M10,17A1,1 0 0,1 11,18A1,1 0 0,1 10,19A1,1 0 0,1 9,18A1,1 0 0,1 10,17M14,17A1,1 0 0,1 15,18A1,1 0 0,1 14,19A1,1 0 0,1 13,18A1,1 0 0,1 14,17M18,17A1,1 0 0,1 19,18A1,1 0 0,1 18,19A1,1 0 0,1 17,18A1,1 0 0,1 18,17M8,14A1,1 0 0,1 9,15A1,1 0 0,1 8,16A1,1 0 0,1 7,15A1,1 0 0,1 8,14M12,14A1,1 0 0,1 13,15A1,1 0 0,1 12,16A1,1 0 0,1 11,15A1,1 0 0,1 12,14M16,14A1,1 0 0,1 17,15A1,1 0 0,1 16,16A1,1 0 0,1 15,15A1,1 0 0,1 16,14M19,12H5V10H19V12M17.92,9H6.08C6.5,6.5 8.5,4.5 11,4.08V2H13V4.08C15.5,4.5 17.5,6.5 17.92,9Z" />
                            </svg>
                            <p>2 Kamar Mandi Luar</p>
                        </div>
                        <div class="flex gap-[10px]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                class="h-[20px] fill-white outline rounded">
                                <title>mosque</title>
                                <path
                                    d="M7 8H17C17.3 8 17.6 8.1 17.8 8.1C17.9 7.8 18 7.4 18 7.1C18 5.8 17.4 4.6 16.3 3.9L12 1L7.7 3.8C6.7 4.6 6 5.8 6 7.1C6 7.5 6.1 7.8 6.2 8.1C6.4 8.1 6.7 8 7 8M24 7C24 5.9 22 4 22 4S20 5.9 20 7C20 7.7 20.4 8.4 21 8.7V13H19V11C19 9.9 18.1 9 17 9H7C5.9 9 5 9.9 5 11V13H3V8.7C3.6 8.4 4 7.7 4 7C4 5.9 2 4 2 4S0 5.9 0 7C0 7.7 .4 8.4 1 8.7V21H10V17C10 15.9 10.9 15 12 15S14 15.9 14 17V21H23V8.7C23.6 8.4 24 7.7 24 7Z" />
                            </svg>
                            <p>Mushola</p>
                        </div>
                        <div class="flex gap-[10px]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                class="h-[20px] fill-white outline rounded">
                                <title>grill</title>
                                <path
                                    d="M8.06,2C7.88,3.17 8.17,4.16 8.95,4.97C9.45,5.47 9.61,6.14 9.42,7H10.41C10.53,6.45 10.55,6 10.45,5.55C10.36,5.13 10.05,4.63 9.5,4.03C9.05,3.47 8.89,2.8 9.05,2H8.06M10.55,2C10.36,3.17 10.66,4.16 11.44,4.97C11.94,5.47 12.09,6.14 11.91,7H12.89C13,6.45 13.03,6 12.94,5.55C12.84,5.13 12.53,4.63 12,4.03C11.53,3.47 11.38,2.8 11.53,2H10.55M13.08,2C12.89,3.17 13.19,4.16 13.97,4.97C14.47,5.47 14.61,6.14 14.39,7H15.42C15.55,6.45 15.56,6 15.47,5.55C15.38,5.13 15.06,4.63 14.53,4.03C14.06,3.47 13.91,2.8 14.06,2H13.08M5,8C5,9.42 5.39,10.7 6.14,11.84C6.87,12.96 7.91,13.85 9.14,14.39L5.16,20.44C5.06,20.56 5,20.75 5,21C5,21.41 5.16,21.69 5.44,21.84C5.56,21.94 5.75,22 6,22C6.41,22 6.69,21.84 6.84,21.56L7.83,19.97H14.2C14.41,20.55 14.79,21.05 15.28,21.42C15.78,21.8 16.36,22 17,22C17.83,22 18.53,21.69 19.13,21.09C19.72,20.5 20,19.8 20,19C20,18.17 19.72,17.47 19.13,16.88C18.53,16.28 17.83,16 17,16C16.36,16 15.78,16.17 15.28,16.55C14.78,16.92 14.42,17.41 14.2,18H9.14L11.11,14.95C11.27,15 11.56,15 12,15C12.44,15 12.73,15 12.89,14.95L13.88,16.5C14.29,15.96 14.84,15.54 15.47,15.28L14.91,14.39C16.03,13.89 17,13 17.79,11.77C18.59,10.5 19,9.27 19,8H5M17,18C17.3,18 17.53,18.09 17.72,18.28C17.91,18.47 18,18.72 18,19C18,19.27 17.91,19.5 17.72,19.71C17.54,19.91 17.28,20 17,20C16.74,20 16.5,19.91 16.29,19.71C16.09,19.5 16,19.26 16,19C16,18.7 16.09,18.47 16.29,18.28C16.5,18.09 16.73,18 17,18Z" />
                            </svg>
                            <p>Tempat dan Alat BBQ</p>
                        </div>
                    </div>
                </div>
            </div>
            <a-carousel dot-position="left" autoplay="true"
                class="relative w-[8cm] lg:w-[15cm] bottom-[7.1cm] lg:bottom-[8cm] left-[9.5cm] lg:left-[25.7cm] rounded-tl-md rounded-bl-md ring-[5px] ring-red-600 ring-offset-4 bg-gray-500">
                <span v-for="(image, index) in imageFasilitas" :key="index">
                    <img :src="image" class="lg:h-[10cm] h-[8cm] rounded-tl-md rounded-bl-md" />
                </span>
            </a-carousel>
        </div>
        <div id="reservasi-section" class="w-fit print:ml-[1cm] pt-[1.4cm] lg:w-screen">
            <p class="text-center font-bold text-[40px]">RESERVASI</p>
            <div class="p-[1cm] print:p-0 lg:w-[25cm] w-[17.5cm] mx-auto ">
                <div class="hidden print:block print:mb-[1cm] mx-auto w-fit">
                    <p
                        class="my-auto font-bold text-black text-center flex text-[35px] flex-row underline decoration-red-600">
                    <p>Villa</p>
                    <p class="text-red-600">W</p>atusaman</p>
                </div>
                <div v-if="(!print)">
                    <a-steps :current="current" :items="items" class="print:hidden"></a-steps>
                </div>
                <a-steps v-else-if="(print == 'true')" :current="current" :items="items" hidden></a-steps>
                <div class="steps-content print:hidden">
                    <component :is="steps[current].component" />
                </div>
                <div class="hidden print:block w-[10cm] border-2 mx-auto mb-[1cm]">
                    <div class="mx-auto border border-black p-[0.5cm]">
                        <p class="text-center">FAKTUR RESERVASI VILLA WATUSAMAN</p>
                        <p class="text-center">{{ formattedDate(invoice.start_date) }} - {{ formattedDate(invoice.end_date)
                        }}</p>
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
                                <p v-if="invoice.sisa_pembayaran == 0" class="font-bold text-green-500 text-[20px]">Status [
                                    LUNAS ]</p>
                                <p v-else-if="invoice.sisa_pembayaran != 0" class="font-bold text-green-500 text-[20px]">
                                    Status [ DP ]
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="border p-[0.4cm] border-black">
                        <p class="text-[12px]">*Silahkan Cetak Untuk Ditunjukan Ke Pihak Villa Waktu CheckIn</p>
                    </div>
                </div>
                <div class="steps-action mt-[0.5cm] print:hidden">
                    <button v-if="current < steps.length - 1 && current != 1" @click="next"
                        class="border border-red-600 p-[5px] bg-red-600 rounded-md text-white hover:bg-red-400">Selanjutnya</button>
                    <button v-if="current == steps.length - 1" type="primary" @click="statusSelesai"
                        class="border border-red-600 p-[5px] bg-red-600 rounded-md text-white hover:bg-red-400">
                        Selesai
                    </button>
                    <button v-if="current > 0 && current != 2" style="margin-left: 8px" @click="prev"
                        class="border border-red-600 p-[5px] rounded-md text-red-600 hover:bg-red-200">Previous</button>
                </div>
            </div>
        </div>
    </div>
    <Footer class="print:hidden">
    </Footer>
    <a-modal v-model:open="isReset" title="Ubah Pasword" class="text-center" :footer="null">
        <a-form :model="formReset" autocomplete="off" @finish="updatePassword">
            <a-form-item name="oldPassword"
                :rules="[{ required: true, message: 'Password Tidak Boleh Kosong' }, { min: 3, message: 'Password Minimal 3 Digit!' }]">
                <a-input-password v-model:value="formReset.oldPassword" placeholder="Old Password"></a-input-password>
            </a-form-item>
            <a-form-item name="newPassword"
                :rules="[{ required: true, message: 'Password Tidak Boleh Kosong' }, { min: 3, message: 'Password Minimal 3 Digit!' }]">
                <a-input-password v-model:value="formReset.newPassword" placeholder="New Password"
                    class="mt-[0.5cm]"></a-input-password>
            </a-form-item>
            <button type="submit"
                class="border-2 border-red-600 rounded-md p-[4px] text-red-600 mt-[5px] hover:bg-red-200">Submit</button>
        </a-form>
    </a-modal>
    <a-modal v-model:open="isOpen" title="Profil" class="text-center" :footer="null" @cancel="closeOTP">
        <a-form :model="formProfil" autocomplete="off" @finish="updateProfil">
            <a-form-item name="name" :rules="[{ required: true, message: 'Nama Tidak Boleh Kosong' }]">
                <p class="ml-[4px] font-mono text-left">Nama</p>
                <a-input v-model:value="formProfil.name" placeholder="Nama"></a-input>
            </a-form-item>
            <a-form-item name="email"
                :rules="[{ required: true, message: 'Nama Tidak Boleh Kosong' }, { type: 'email', message: 'Input Email Yang Valid' }]">
                <p class="ml-[4px] font-mono text-left">Email</p>
                <a-input v-model:value="formProfil.email" placeholder="Email" :disabled="true"></a-input>
            </a-form-item>
            <a-form-item name="nomorTelepon" :rules="[{ required: true, message: 'Nomor Tidak Boleh Kosong' }]">
                <p class="ml-[4px] font-mono text-left">Nomor Telepon</p>
                <a-input v-model:value="formProfil.nomorTelepon" placeholder="08..."></a-input>
            </a-form-item>
            <button html-type="submit"
                class="font-bold  rounded-xl w-[3cm] text-red-600 h-[1cm] mx-auto border-[2px] hover:bg-red-400 hover:text-white border-red-600 transition-all duration-[0.5s]">Ubah</button>
        </a-form>
        <button
            class="font-bold  mt-[5px] rounded-xl w-[3cm] text-white bg-red-600 h-[1cm] mx-auto border-[2px] hover:bg-red-400 border-red-600 transition-all duration-[0.5s]"
            @click="resetPassword">Ubah Password</button>
        <div v-if="showOtp" class="mt-[0.5cm] w-fit mx-auto">
            <a-form :model="otp" autocomplete="off" @finish="verifOTP">
                <p class="text-[20px] font-bold mb-[5px]">PIN</p>
                <PinInput @update:pin="handlePinUpdate"></PinInput>
                <button type="submit"
                    class="border-2 border-red-600 rounded-md p-[4px] text-white bg-red-600 mt-[20px] hover:bg-red-400">Submit</button>
            </a-form>
        </div>
    </a-modal>
</template>
<script>
import { local } from '../api';
import { ref } from 'vue';

//import mdi icon
import SvgIcon from '@jamescoyle/vue-icon'
import {
    mdiAccountMinus, mdiDoor,
    mdiAccountMultiplePlus, mdiBedEmpty
} from '@mdi/js'

import { mapState, mapActions } from 'vuex'

import axios from 'axios';
import Navbar from './template/Navbar.vue'
import Alert from './template/Alert.vue'
import StepOne from './steps/StepOne.vue'
import StepTwo from './steps/StepTwo.vue'
import StepThree from './steps/StepThree.vue'
import Review from './template/Review.vue'
import moment from 'moment';
import PinInput from './template/Pin.vue'
import Footer from './template/Footer.vue'
import { message } from 'ant-design-vue';

export default {
    data() {
        return {
            path: {
                mdiAccountMinus, mdiDoor, mdiAccountMultiplePlus,
                mdiBedEmpty
            },
            image: [],
            user: {},
            userRes: [],
            reservasis: [],
            invoice: {},
            current: ref(0),
            formProfil: {
                name: '',
                email: '',
                nomorTelepon: ''
            },
            formReset: {
                oldPassword: '',
                newPassword: ''
            },
            otp: '',
            imageFasilitas: [
                '/Pool_02.jpg',
                '/Pool.jpg',
                '/Public.jpg',
                '/Public_02.jpg',
                '/Public_03.jpg'
            ],
            steps: [
                { title: 'Isi Data', content: 'First Content', component: StepOne },
                { title: 'Pilih Pembayaran', content: 'Second Content', component: StepTwo },
                { title: 'Faktur', content: 'Third Content', component: StepThree }
            ],
            items: [],
            isOpen: ref(false),
            showOtp: ref(false),
            isReset: ref(false),
            loading: ref(true),
            print: ref(false)
        }
    },
    computed: {
        ...mapState(['isInputResValid', 'alert']),
        sortImage() {
            this.checkStatusRes()
            return this.image.slice().sort((a, b) => a.id - b.id)
        },
    },
    mounted() {
        this.loading = true
        this.getData()
        this.getUser()
        this.getReservasi()
        this.items = this.steps.map(item => ({
            key: item.title,
            title: item.title
        }))
    },
    methods: {
        ...mapActions(['reservasi', 'showAlert', 'hideAlert']),
        async getData() {
            await axios.get(local + 'kamars', {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res)
                    this.image = res.data.data.data.sort((a, b) => a.nomor_kamar - b.nomor_kamar)
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                })
        },
        async getReservasi() {
            const id = localStorage.getItem('idUser')
            await axios.get(local + `reservasi-user/${id}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log('reservasi: ', res)

                    this.reservasis = res.data.data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))

                    this.loading = false
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                })
        },
        async getUser() {
            const id = localStorage.getItem('idUser')
            await axios.get(local + 'users/' + id, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res)
                    this.user = res.data.data
                    this.formProfil.name = this.user.name
                    this.formProfil.email = this.user.email
                    this.formProfil.nomorTelepon = this.user.nomor_telepon

                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                })

            await axios.get(local + `reservasi-user/${id}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res)
                    this.userRes = res.data.data
                    this.checkStatusRes()
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data.message)
                })
        },
        async statusSelesai() {
            const id = localStorage.getItem('idUser')
            await axios.put(local + `update-status/${id}`, {
                from_status: 'INVOICE',
                to_status: 'SELESAI'
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(async (res) => {
                    console.log(res)
                    this.print = true
                    setTimeout(() => {
                        window.print()
                        this.print = false
                    }, 2000)
                    window.location.reload()
                })
                .catch((error) => {
                    console.error(error.response)
                    console.error(error.response.data)
                })
        },
        async updateProfil() {
            const id = this.user.id
            const loadingMessage = message.loading('Mengubah...', 0)
            await axios.put(local + `update-profil/${id}?name=${this.formProfil.name}&nomor_telepon=${this.formProfil.nomorTelepon}`, {}, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    loadingMessage()
                    console.log('UPDATE: ', res)
                    console.log('ID UPDATE', id)
                    this.getUser()
                    message.success(res.data.message)
                })
                .catch((error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    message.error(error.response.data.message)
                })
        },
        async cetak(idReservasi) {
            const id = idReservasi
            await axios.get(local + `reservasi-id/${id}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log('RESERVASI CETAK: ', res)
                    this.invoice = res.data.data
                    this.print = true
                    setTimeout(() => {
                        window.print()
                        this.print = false
                    }, 1000)
                })

        },
        async cancel(idReservasi) {
            const id = idReservasi
            const loadingMessage = message.loading('Mengirim...', 2)
            await axios.post(local + `send-whatsapp-cancel/${id}`, {}, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    loadingMessage()
                    console.log(res)
                    message.success('Proses Batal Berhasil Dikirim!', 2)
                })
                .catch((error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    message.error('Proses Batal Gagal!', 2)
                })
        },
        async updatePassword() {
            const id = this.user.id
            const loadingMessage = message.loading('Memverifikasi...', 0)
            await axios.put(local + `password-change/${id}`, {
                old_password: this.formReset.oldPassword,
                new_password: this.formReset.newPassword
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    loadingMessage()
                    if (res.data.message == 'Password Tidak Sesuai!') {
                        message.error(res.data.message, 2)
                    } else {
                        this.isReset = false
                        this.showOtp = false
                        message.success(res.data.message, 2)
                    }
                })
                .catch((error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    message.error(error.response.data.message, 2)
                })
        },
        async verifOTP() {
            const id = this.user.id
            const loadingMessage = message.loading('Memverifikasi...', 0)
            await axios.post(local + `reset-otp/${id}`, {
                otp: this.otp
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    loadingMessage()
                    if (res.data.message == 'Kode OTP Salah!') {
                        message.error(res.data.message, 2)
                    } else {
                        this.isReset = true
                        message.success(res.data.message, 2)
                    }
                })
                .catch((error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    if (error.response.data.message === 'Attempt to read property "otp" on null') {
                        message.error('Kode OTP Sudah Hangus!', 2)
                    } else {
                        message.error(error.response.data.message, 2)
                    }
                })
        },
        async resetPassword() {
            const loadingMessage = message.loading('Membuat OTP...', 0)
            await axios.post(local + 'reset-password', {
                id_user: this.user.id
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    this.sendOTP()
                    loadingMessage()
                    console.log('RESET PASSWORD: ', res)
                    this.showOtp = true
                    message.success(res.data.message)
                })
                .catch((error) => {
                    loadingMessage()
                    console.error(error.response)
                    console.error(error.response.data)
                    message.error(error.response.data.message)
                })
        },
        async sendOTP() {
            const id = this.user.id
            await axios.get(local + `send-email-otp/${id}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
        },
        harimindua(startDate) {
            const today = new Date()
            const start = new Date(startDate)
            const minduahari = new Date(start)
            minduahari.setDate(start.getDate() - 2)

            return today >= minduahari
        },
        handlePinUpdate(pin) {
            this.otp = pin
        },
        profil() {
            this.isOpen = true
        },
        close() {
            this.isOpen = false
            this.isReset = false
        },
        closeOTP() {
            this.getUser()
            this.showOtp = false
        },
        scrollToReservasi() {
            const reservasiSection = document.getElementById('reservasi-section');
            if (reservasiSection) {
                reservasiSection.scrollIntoView({ behavior: 'smooth' })
            }
        },
        formattedNumber(number) {
            if (typeof number !== 'number') {
                return '0';
            }
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        formattedDate(time) {
            return moment(time).format('DD MMM YYYY')
        },
        checkStatusRes() {
            let i
            for (i = 0; i < this.userRes.length; i++) {
                if (this.userRes[i].status === 'PEMBAYARAN') {
                    this.current = 1
                    break
                } else if (this.userRes[i].status === 'INVOICE') {
                    console.log('RES INVOICE: ', this.userRes[i].status)
                    this.current = 2
                    break;
                } else {
                    this.current = 0
                }
            }
        }, //Step Ant Design Vue
        async next() {
            if (this.isInputResValid) {
                this.current++
                this.getReservasi()
            } else {
                message.error('Mohon Lengkapi Data Reservasi Terlebih Dahulu!', 2)
            }
        },
        prev() {
            if (this.current != 2) {
                this.getReservasi()
                this.current--
            }
        }
    },
    components: {
        Navbar,
        SvgIcon,
        Alert,
        PinInput,
        Footer,
        Review
    }
}
</script>

<style scoped>
.steps-content {
    margin-top: 16px;
    border: 5px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    padding-top: 80px;
}
</style>