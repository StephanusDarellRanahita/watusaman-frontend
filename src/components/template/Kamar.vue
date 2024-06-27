<template>
    <div class="flex overflow-auto">
        <div v-for="(data, index) in kamar" :key="index" class="border-2 gap-[0.5cm]">
            <img :src="data.image" class="h-[10cm]  rounded-md" />
        </div>
    </div>
</template>
<script>
import { local } from '../../api';
import axios from 'axios';

export default {
    nama: 'TemplateKamar',
    data() {
        return {
            kamar: []
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        async getData() {
            await axios.get(local + 'kamars', {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res)
                    this.kamar = res.data.data.data
                    console.log(this.kamar)
                })
        }
    }
}
</script>
