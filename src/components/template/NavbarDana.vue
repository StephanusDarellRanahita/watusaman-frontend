<template>
    <div class="flex justify-between absolute z-40 w-full h-[5cm] bg-gradient-to-b from-[#2196f3] from-70% to-transparent px-[2cm]">
        <img src="/Dana.jpg" class="h-[3cm]" />
        <div class="mt-[1.5cm] text-white font-bold ">
            <a href="/dana" @click="logoutDana" v-if="isLoggedInDana" class="my-auto">Logout</a>
        </div>
    </div>
</template>
<script>
import { RouterLink } from 'vue-router';
import { mapState, mapActions } from 'vuex';
export default {
    computed: {
        ...mapState(['isLoggedInDana'])
    },
    mounted() {
        console.log('Logged In Dana: ', this.isLoggedInDana)
    },
    methods: {
        ...mapActions(['logoutDana'])
    },
    components: { RouterLink }
}
</script>