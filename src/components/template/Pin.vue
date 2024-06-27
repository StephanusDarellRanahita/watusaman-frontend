<template>
    <div class="flex space-x-2">
        <input v-for="(digit, index) in pin" :key="index" type="text" maxlength="1"
            class="w-12 h-12 text-center border-2 border-gray-300 rounded" v-model="pin[index]" @input="onInput(index)"
            @keydown.delete="onDelete(index)" ref="pinInputs" />
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            pin: Array(6).fill("")
        };
    },
    methods: {
        onInput(index) {
            if (this.pin[index].length === 1 && index < 5) {
                this.$refs.pinInputs[index + 1].focus();
            }
            this.updatePin();
        },
        onDelete(index) {
            if (this.pin[index] === "" && index > 0) {
                this.$refs.pinInputs[index - 1].focus();
            }
            this.updatePin();
        },
        updatePin() {
            const pinValue = this.pin.join("");
            this.$emit("update:pin", pinValue); // Emit event untuk mengirimkan nilai PIN
        }
    }
};
</script>
  