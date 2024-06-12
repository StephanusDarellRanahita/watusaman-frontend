import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

//import store vuex
import  store from './store'
//import router
import router from './router'
import Antd from 'ant-design-vue'
import moment from 'moment'

const app = createApp(App)

app.config.globalProperties.$filters = {
    timeAgo(date) {
        return moment(date).fromNow()
    }
}

app.use(router)
.use(Antd)
.use(store)
.mount('#app')