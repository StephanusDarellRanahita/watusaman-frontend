<template>
    <div class="bg-black h-[2cm] w-full shadow-xl fixed z-20">
        <div class="flex gap-[1cm] justify-between mx-[1cm] h-full">
            <p class="my-auto font-bold text-white text-[35px] flex underline decoration-red-600"><p>Villa</p><p class="text-red-600">W</p>atusaman</p>
            <div class="flex gap-[1cm] font-bold h-full">
                <template v-if="!isLoggedIn">
                    <slot></slot>
                </template>
                <a href="/" @click="clickLogout" v-if="isLoggedIn" class="my-auto text-white text-[25px]">Logout</a>
            </div>
        </div>
    </div>
</template>
<script>
import { message } from 'ant-design-vue';
import { RouterLink } from 'vue-router'; //import RouterLink

import { mapState, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState(['isLoggedIn']),
    },
    mounted() {
        console.log(this.isLoggedIn)
    },
    methods: {
        ...mapActions(['logout']),
        async clickLogout() {
            message.success('Anda Telah Logout!',2)
            await this.logout()
        }
    },
    components: { RouterLink }
}
</script>