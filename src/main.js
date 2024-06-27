import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

//import store vuex
import  store from './store'
//import router
import router from './router'
import Antd from 'ant-design-vue'
import moment from 'moment'
//import ApexCharts
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)

app.config.globalProperties.$filters = {
    timeAgo(date) {
        return moment(date).fromNow()
    }
}

app.use(router)
.use(Antd)
.use(VueApexCharts)
.use(store)
.mount('#app')