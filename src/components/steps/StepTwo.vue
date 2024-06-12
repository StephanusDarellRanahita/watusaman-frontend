<template>
    <div class="flex justify-center gap-[0.5cm]">
        <div v-for="(method, index) in payMethod" :key="index">
            <button @click="handleClick(method)"><img :src="method" class="h-[1cm] rounded-md border bg-white" />
            </button>
        </div>
        <img :src="image" />
    </div>
    <a-modal :title="jenis" :open="isOpen" @cancel="close">
        HALLO SEMUA</a-modal>
</template>
<script>
import { ref } from 'vue';
import { local } from '../../api'

export default {
    name: 'StepTwo',
    data() {
        return {
            jenis: '',
            isOpen: ref(false),
            payMethod: [
                '/Dana.jpg', '/Gopay.png', '/Ovo.png', '/BCA.png', '/BRI.png'
            ]
        }
    },
    methods: {
        handleClick(tipe) {
            if(tipe === '/Dana.jpg')
                this.jenis = 'DANA'
            else if(tipe === '/Gopay.png')
                this.jenis = 'GOPAY'
            else if(tipe === '/Ovo.png')
                this.jenis = 'OVO' 
            else if(tipe === '/BCA.png')
                this.jenis = 'BCA' 
            else if(tipe === '/BRI.png')
                this.jenis = 'BRI'

            console.log(this.jenis)
            this.isOpen = true
            console.log(tipe)
        },
        close() {
            this.isOpen = false
        }
    },
    components: {

    }
}
</script>