<template>
  <router-view />
</template>
<script>
import Login from './components/auth/Login.vue'

export default {
  name: 'App',
  components: {
    Login
  }
}
</script>

