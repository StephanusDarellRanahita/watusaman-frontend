<template>
    <div class="fixed z-30">
        <div v-if="visible" :class="['absolute', background, 'ml-[20cm]', 'mt-[0.5cm]', 'px-[1cm]', 'rounded-md']" class="w-[10cm] text-center">
            <p :class="['font-mono', text]">{{ message }}</p>
        </div>
    </div>
</template>
<script>

export default {
    props: {
        visible: { type: Boolean},
        message: { type: String},
        background: { type: String },
        text: { type: String }

    },
}
</script>