<template>
    <div class="bg-yellow-200 h-[1.5cm] w-full shadow-xl fixed z-20">
        <div class="flex gap-[1cm] justify-between mx-[1cm] h-full">
            <p class="my-auto font-bold text-orange-500 text-[20px]">Villa Watusaman</p>
            <div class="flex gap-[1cm] font-bold h-full">
                <template v-if="!isLoggedIn">
                    <slot></slot>
                </template>
                <a href="/" @click="logout" v-if="isLoggedIn" class="my-auto">Logout</a>
            </div>
        </div>
    </div>
</template>
<script>
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
        ...mapActions(['logout'])
    },
    components: { RouterLink }
}
</script>