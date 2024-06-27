<template>
    <div class="h-fit bg-black text-white flex gap-[1cm] p-[1cm]">
        <div class="flex flex-col gap-[0.2cm]">
            <p class="text-[30px] underline decoration-red-600 font-bold">Villa<a class="text-red-600">W</a>atusaman</p>
            <button class="hover:ring-[2px] p-[5px] hover:ring-blue-600" @click="mapsClick"><img src="/MapsVilla.jpg" class="h-[8cm]" /></button>
        </div>
        <div class="my-auto text-center">
            <p class="font-bold text-[30px]">Villa Watusaman</p>
            <p>Watusaman Homestay, Gallery & Resto Bakmijawa</p>
            <p>Ringroad Selatan Jl. Parangtritis km 4.5 Dusun Saman 1. No 98. Rt 11. Sewon Bantul</p>
            <p>Daerah Istimewa Yogyakarta</p>
        </div>
        <div class="flex flex-col border-l">
            <div class="ml-[1cm] gap-[0.5cm]">
                <p class="text-[20px] underline underline-offset-4">Contact</p>
                <button class="flex gap-[10px]" @click="instaClick">
                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-red-600 h-[20px] mt-[0.5cm]" viewBox="0 0 24 24">
                        <title>instagram</title>
                        <path
                            d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                    </svg>
                    <p class="mt-[17px] text-[15px]">@villa.watusaman.jogja</p>
                </button>
                <div class="flex gap-[10px] mt-[10px]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-red-600 h-[20px] mt-[1px]" viewBox="0 0 24 24">
                        <path
                            d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.5 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9 7.34C8.86 7.34 8.7 7.33 8.53 7.33Z" />
                    </svg>
                    <p class=" text-[15px]">0811-1112-8181</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    nama: 'Footer',
    methods: {
        mapsClick() {
            window.open('https://www.google.com/maps/place/Villa+Watusaman+Jogja/@-7.835298,110.3618171,17z/data=!3m1!4b1!4m9!3m8!1s0x2e7a57b2fae3748f:0x65e7b3b73d603294!5m2!4m1!1i2!8m2!3d-7.835298!4d110.364392!16s%2Fg%2F11b63vx693?entry=ttu')
        },
        instaClick() {
            window.open('https://www.instagram.com/villa.watusaman.jogja/')
        }
    },
}
</script>